import pandas as pd
from collections import Counter
import random
from tqdm import tqdm
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import time

def parse_str_list(str_list):
    if isinstance(str_list, list):
        return str_list
    try:
        return eval(str_list)
    except:
        return []

def filter_playlists(data, tag_keywords):
    tag_set = set(tag_keywords)
    return [playlist for playlist in data if tag_set.issubset(set(parse_str_list(playlist['tags'])))]

def melon_to_spotify(melon_id_list, mapping_filepath):
    df_mapping = pd.read_csv(mapping_filepath)
    df_mapping = df_mapping[df_mapping['spotify_id'] != "null"]  # 유효한 스포티파이 ID만 선택
    df_mapping['melon_id'] = df_mapping['melon_id'].astype(str)  # 멜론 ID를 문자열로 변환
    melon_ids = pd.Series(melon_id_list, name='melon_id').astype(str)
    merged = melon_ids.to_frame().merge(df_mapping, on='melon_id', how='left')
    return merged['spotify_id'].tolist()

def create_feature_matrix(data):
    song_index = {}
    row_indices = []
    col_indices = []
    data_values = []
    idx = 0
    for playlist in data:
        playlist_id = playlist['id']
        for song in parse_str_list(playlist['songs']):
            if song not in song_index:
                song_index[song] = idx
                idx += 1
            row_indices.append(playlist_id)
            col_indices.append(song_index[song])
            data_values.append(1)
    return csr_matrix((data_values, (row_indices, col_indices)), shape=(max(row_indices) + 1, len(song_index))), song_index

def apply_knn_songs(feature_matrix, target_song_indices, n_neighbors=5):
    if not target_song_indices:
        return []
    
    model = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine', algorithm='brute')
    model.fit(feature_matrix.T)  # Transpose to fit songs instead of playlists
    _, indices = model.kneighbors(feature_matrix.T[target_song_indices])
    return indices.flatten()

def main_recommend_with_knn(input_tags, num_songs):
    
    train_filepath = r'resources\static\data\train.csv'
    mapping_filepath = r'resources\static\data\melontospotify (1).csv'
    
    half_num_songs = num_songs // 2

    train_data = pd.read_csv(train_filepath).to_dict('records')

    print("태그 기반 플레이리스트 필터링 중...")
    tagged_playlists = filter_playlists(train_data, input_tags)
    print(f"태그 기반 플레이리스트 필터링 완료. {len(tagged_playlists)}개의 플레이리스트가 선택되었습니다.")

    start_time = time.time()
    
    print("태그된 곡들 추출 중...")
    tagged_songs = [song for playlist in tqdm(tagged_playlists, desc='Extracting tagged songs') for song in parse_str_list(playlist['songs'])]
    tagged_song_counter = Counter(tagged_songs)
    print(f"태그된 곡들 추출 완료. {len(tagged_songs)}개의 곡이 선택되었습니다.")

    print("멜론 ID를 스포티파이 ID로 변환 중...")
    popular_songs = [song for song, _ in tagged_song_counter.most_common(num_songs)]
    random_songs = random.sample([song for song in tagged_songs if song not in popular_songs], num_songs)

    popular_spotify_ids = melon_to_spotify(popular_songs, mapping_filepath)
    random_spotify_ids = melon_to_spotify(random_songs, mapping_filepath)

    print("멜론 ID를 스포티파이 ID로 변환 완료.")

    # 인기 곡과 랜덤 곡 리스트
    popular_recommendations = [spotify_id for spotify_id in popular_spotify_ids if spotify_id]
    random_recommendations = [spotify_id for spotify_id in random_spotify_ids if spotify_id]

    # KNN을 사용하여 곡 추천
    print("KNN을 사용하여 곡 추천 중...")
    feature_matrix, song_index = create_feature_matrix(train_data)
    target_song_indices = [song_index.get(song) for song in popular_spotify_ids + random_spotify_ids if song_index.get(song) is not None]
    knn_recommendations = apply_knn_songs(feature_matrix, target_song_indices, n_neighbors=5)
    knn_recommended_songs = [list(song_index.keys())[i] for i in knn_recommendations if i in song_index.values()]
    print("KNN을 사용한 곡 추천 완료.")

    # 최종 추천 리스트 생성
    final_recommendations = popular_recommendations + random_recommendations + knn_recommended_songs
    final_recommendations = list(dict.fromkeys(final_recommendations))  # 중복 제거
    print(len(final_recommendations))
    final_recommendations = [song for song in final_recommendations if pd.notna(song)]  # NaN 제거
    print(len(final_recommendations))

    # KNN 추천 결과에서 인기 곡과 랜덤 곡의 비율 맞추기
    knn_popular_songs = [song for song in final_recommendations if song in popular_spotify_ids]
    knn_random_songs = [song for song in final_recommendations if song in random_spotify_ids]

    # 인기 곡과 랜덤 곡 각각 절반씩 맞추기
    if len(knn_popular_songs) > half_num_songs:
        knn_popular_songs = knn_popular_songs[:half_num_songs]
    if len(knn_random_songs) > half_num_songs:
        knn_random_songs = knn_random_songs[:half_num_songs]

    # 부족한 곡을 반대쪽 리스트에서 채우기
    while len(knn_popular_songs) < half_num_songs and len(knn_random_songs) > half_num_songs:
        knn_popular_songs.append(knn_random_songs.pop())

    while len(knn_random_songs) < half_num_songs and len(knn_popular_songs) > half_num_songs:
        knn_random_songs.append(knn_popular_songs.pop())

    final_knn_recommendations = knn_popular_songs + knn_random_songs

    # 최종 추천 리스트에서 곡 수가 부족할 경우 추가로 곡을 추천
    while len(final_knn_recommendations) < num_songs:
        additional_songs = random.sample(tagged_songs, num_songs - len(final_knn_recommendations))
        additional_spotify_ids = melon_to_spotify(additional_songs, mapping_filepath)
        additional_recommendations = [spotify_id for spotify_id in additional_spotify_ids if spotify_id and spotify_id not in final_knn_recommendations]
        final_knn_recommendations.extend(additional_recommendations)

    final_knn_recommendations = final_knn_recommendations[:num_songs]  # 필요한 곡 수만큼 자르기

    end_time = time.time()

    print("추천 결과:")
    print(pd.DataFrame(final_knn_recommendations, columns=['Spotify ID']).to_string(index=False, col_space=20))
    
    print(f"추천에 소요된 시간: {end_time - start_time:.2f}초")

    return final_knn_recommendations