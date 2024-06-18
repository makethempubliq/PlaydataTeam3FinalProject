import pandas as pd
import numpy as np
from collections import Counter
import random
from tqdm import tqdm
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import time
import itertools

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
    df_mapping = df_mapping[df_mapping['spotify_id'] != "null"]
    df_mapping['melon_id'] = df_mapping['melon_id'].astype(str)
    melon_ids = pd.Series(melon_id_list, name='melon_id').astype(str)
    merged = melon_ids.to_frame().merge(df_mapping, on='melon_id', how='left')
    return merged['spotify_id'].dropna().tolist()

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
    model.fit(feature_matrix.T)
    _, indices = model.kneighbors(feature_matrix.T[target_song_indices])
    return indices.flatten()

def generate_tag_combinations(tags):
    tag_combinations = []
    for i in range(len(tags), 0, -1):
        tag_combinations.extend(list(itertools.combinations(tags, i)))
    return tag_combinations

def main_recommend_with_knn():
    train_filepath = r'.\data\train.csv'
    mapping_filepath = r'.\data\melontospotify.csv'
    
    print("태그를 입력하세요 (공백으로 구분): ")
    input_tags = input().strip().split()
    
    while True:
        print("플레이리스트의 길이를 입력하세요 (예: 30분이면 0시간 30분, 2시간이면 2시간 00분). 형식: ?시간 ??분")
        time_input = input().strip()
        time_parts = time_input.split()
        if len(time_parts) == 2 and '시간' in time_parts[0] and '분' in time_parts[1]:
            try:
                hours = int(time_parts[0].replace('시간', ''))
                minutes = int(time_parts[1].replace('분', ''))
                break
            except ValueError:
                pass
        print("입력 형식이 잘못되었습니다. 다시 시도해 주세요.")
    
    num_songs = int((hours * 60 + minutes) // 3.5)
    half_num_songs = num_songs // 2

    train_data = pd.read_csv(train_filepath).to_dict('records')

    tag_combinations = generate_tag_combinations(input_tags)

    tagged_playlists = []
    for tags in tag_combinations:
        tagged_playlists = filter_playlists(train_data, tags)
        if tagged_playlists:
            print(f"태그 조합 {tags}에 대해 {len(tagged_playlists)}개의 플레이리스트가 선택되었습니다.")
            break

    if not tagged_playlists:
        print("입력된 태그로 플레이리스트를 찾을 수 없습니다.")
        return []

    start_time = time.time()
    
    print("태그된 곡들 추출 중...")
    tagged_songs = [song for playlist in tqdm(tagged_playlists, desc='Extracting tagged songs') for song in parse_str_list(playlist['songs'])]
    if not tagged_songs:
        print("태그된 곡을 찾을 수 없습니다.")
        return []
    
    tagged_song_counter = Counter(tagged_songs)
    print(f"태그된 곡들 추출 완료. {len(tagged_songs)}개의 곡이 선택되었습니다.")

    print("멜론 ID를 스포티파이 ID로 변환 중...")
    most_common_songs = [song for song, _ in tagged_song_counter.most_common(1000)]
    converted_songs = melon_to_spotify(most_common_songs, mapping_filepath)
    popular_spotify_ids = converted_songs[:half_num_songs]

    remaining_needed = num_songs - len(popular_spotify_ids)
    random_songs = random.sample(tagged_songs, remaining_needed)
    
    print(f"인기 곡 수: {len(popular_spotify_ids)}")

    print("멜론 ID를 스포티파이 ID로 변환 완료.")

    # KNN을 사용하여 곡 추천
    print("KNN을 사용하여 곡 추천 중...")
    feature_matrix, song_index = create_feature_matrix(train_data) ###########
    target_song_indices = [song_index.get(song) for song in random_songs if song_index.get(song) is not None]
    print(f"타겟 곡 인덱스 수: {len(target_song_indices)}")
    
    if target_song_indices:
        knn_recommendations = apply_knn_songs(feature_matrix, target_song_indices, n_neighbors=5)
        knn_recommended_songs = [list(song_index.keys())[i] for i in knn_recommendations if i in song_index.values()]
    else:
        knn_recommended_songs = []
    
    print("KNN을 사용한 곡 추천 완료.")
    print(f"KNN 추천 곡 수: {len(knn_recommended_songs)}")

    # NaN 제거
    knn_recommended_songs = [song for song in knn_recommended_songs if song is not None]

    # KNN 추천 곡을 스포티파이 ID로 변환
    knn_spotify_ids = melon_to_spotify(knn_recommended_songs, mapping_filepath)

    # 최종 추천 리스트 생성
    final_recommendations = popular_spotify_ids + knn_spotify_ids

    # 추천곡 수가 부족할 경우 랜덤으로 채움
    if len(final_recommendations) < num_songs:
        additional_needed = num_songs - len(final_recommendations)
        additional_songs = random.sample(tagged_songs, additional_needed)
        additional_spotify_ids = melon_to_spotify(additional_songs, mapping_filepath)
        final_recommendations += additional_spotify_ids[:additional_needed]

    # 정확한 수의 곡을 보장하기 위해 자르기
    final_recommendations = final_recommendations[:num_songs]

    # 최종 추천 곡의 순서 랜덤 섞기
    random.shuffle(final_recommendations)

    end_time = time.time()

    print("추천 결과:")
    print(pd.DataFrame(final_recommendations, columns=['Spotify ID']).to_string(index=False, col_space=20))
    
    print(f"추천에 소요된 시간: {end_time - start_time:.2f}초")

    return final_recommendations

main_recommend_with_knn()
