import pandas as pd
from collections import Counter
import random
from tqdm import tqdm
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import time, io, boto3, yaml

with open('s3config.yaml', 'r') as f:
    config = yaml.safe_load(f)

s3_client = boto3.client(
    service_name=config['service_name'],
    region_name=config['region_name'],
    aws_access_key_id=config['access_key'],
    aws_secret_access_key=config['secret_key']
)
bucket_name = config['bucket_name']

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

def melon_to_spotify(melon_id_list):
    try:
        mtos = s3_client.get_object(Bucket=bucket_name, Key="data/melontospotify.csv")
        df_mapping = pd.read_csv(io.BytesIO(mtos["Body"].read()))
    except Exception as e:
        print(f"Error: {e}")
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

def main_recommend_with_knn(input_tags, num_songs):
    try:
        train = s3_client.get_object(Bucket=bucket_name, Key="data/train.csv")
        train_data = pd.read_csv(io.BytesIO(train["Body"].read())).to_dict('records')
    except Exception as e:
        print(f"Error: {e}")
    
    half_num_songs = num_songs // 2

    print("태그 기반 플레이리스트 필터링 중...")
    tagged_playlists = filter_playlists(train_data, input_tags)
    print(f"태그 기반 플레이리스트 필터링 완료. {len(tagged_playlists)}개의 플레이리스트가 선택되었습니다.")

    start_time = time.time()
    
    print("태그된 곡들 추출 중...")
    tagged_songs = [song for playlist in tqdm(tagged_playlists, desc='Extracting tagged songs') for song in parse_str_list(playlist['songs'])]
    tagged_song_counter = Counter(tagged_songs)
    print(f"태그된 곡들 추출 완료. {len(tagged_songs)}개의 곡이 선택되었습니다.")

    print("멜론 ID를 스포티파이 ID로 변환 중...")
    most_common_songs = [song for song, _ in tagged_song_counter.most_common(1000)]
    converted_songs = melon_to_spotify(most_common_songs)
    popular_spotify_ids = converted_songs[:half_num_songs]

    remaining_needed = half_num_songs - len(popular_spotify_ids)
    if remaining_needed > 0:
        random_songs = random.sample([song for song in tagged_songs if song not in most_common_songs], remaining_needed)
        random_spotify_ids = melon_to_spotify(random_songs)
        popular_spotify_ids.extend(random_spotify_ids)
    else:
        random_songs = random.sample([song for song in tagged_songs if song not in most_common_songs], half_num_songs)
        random_spotify_ids = melon_to_spotify(random_songs)
    
    print(f"인기 곡 수: {len(popular_spotify_ids)}")
    print(f"랜덤 곡 수: {len(random_spotify_ids)}")

    print("멜론 ID를 스포티파이 ID로 변환 완료.")

    # KNN을 사용하여 곡 추천
    print("KNN을 사용하여 곡 추천 중...")
    feature_matrix, song_index = create_feature_matrix(train_data)
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
    knn_spotify_ids = melon_to_spotify(knn_recommended_songs)

    # 최종 추천 리스트 생성
    final_recommendations = popular_spotify_ids[:half_num_songs] + knn_spotify_ids[:half_num_songs]
    
    # 추천곡 수가 부족할 경우 랜덤으로 채움
    if len(final_recommendations) < num_songs:
        additional_needed = num_songs - len(final_recommendations)
        additional_songs = random.sample([song for song in tagged_songs if song not in final_recommendations], additional_needed)
        additional_spotify_ids = [song for song in melon_to_spotify(additional_songs) if song]
        final_recommendations += additional_spotify_ids[:additional_needed]

    # 정확한 수의 곡을 보장하기 위해 자르기
    final_recommendations = final_recommendations[:num_songs]

    end_time = time.time()

    print("추천 결과:")
    print(pd.DataFrame(final_recommendations, columns=['Spotify ID']).to_string(index=False, col_space=20))
    
    print(f"추천에 소요된 시간: {end_time - start_time:.2f}초")

    return final_recommendations