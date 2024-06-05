import argparse
import os
import json
import numpy as np

def inference(model, test_data):
    # 모델을 사용하여 예측 수행
    predictions = model.predict(test_data)
    return predictions

def load_model(model_path):
    # 모델 로드
    # 실제로는 모델을 로드하는 코드가 필요
    with open(model_path, 'r') as f:
        model = json.load(f)
    return model

def load_test_data(test_data_path):
    # 테스트 데이터 로드
    with open(test_data_path, 'r') as f:
        test_data = json.load(f)
    return test_data

def run_inference(args):
    model = load_model(args.model_path)
    test_data = load_test_data(args.test_data_path)
    predictions = inference(model, test_data)
    
    # 예측 결과 저장
    with open(args.output_path, 'w') as f:
        json.dump(predictions, f)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inference script")
    parser.add_argument('--model_path', type=str, required=True, help='Path to the model file')
    parser.add_argument('--test_data_path', type=str, required=True, help='Path to the test data file')
    parser.add_argument('--output_path', type=str, required=True, help='Path to save the predictions')
    
    args = parser.parse_args()
    run_inference(args)

import json
from collections import Counter
import ast

# 데이터 파일 로드
def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# 문자열로 된 리스트를 파이썬 리스트로 변환
def parse_str_list(str_list):
    if isinstance(str_list, list):
        return str_list
    try:
        return json.loads(str_list.replace("'", '"'))
    except json.JSONDecodeError:
        return []

# 주어진 태그를 포함하는 플레이리스트 필터링
def filter_playlists(data, tag_keyword):
    filtered_data = []
    for playlist in data:
        tags = parse_str_list(playlist['tags'])
        if tag_keyword in tags:
            filtered_data.append(playlist)
    return filtered_data

# 노래 메타데이터 로드
def load_song_meta(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        song_meta = json.load(file)
    song_dict = {int(song['id']): {'name': song['song_name'], 'artists': parse_str_list(song['artist_name_basket'])} for song in song_meta}
    return song_dict

# 플레이리스트에서 노래 출현 빈도 계산 및 노래 정보 추출
def get_most_common_songs(filtered_data, song_meta, num_songs):
    song_counter = Counter()
    for playlist in filtered_data:
        songs = parse_str_list(playlist['songs'])
        song_counter.update(songs)
    most_common = song_counter.most_common(num_songs)
    return [(song_meta[song_id]['name'], song_meta[song_id]['artists'], count) for song_id, count in most_common if song_id in song_meta]

def main():
    # 파일 경로 설정
    train_filepath = r'C:\Users\Playdata\Downloads\MelonRec-master\MelonRec-master\res\train.json'
    song_meta_filepath = r'C:\Users\Playdata\Downloads\MelonRec-master\MelonRec-master\res\song_meta.json'
    
    # 태그 입력받기
    print("태그를 입력하세요: ")
    input_tag = input().strip()
    
    # 플레이리스트의 길이 입력받기
    print("플레이리스트의 길이를 입력하세요 (예: 1시간 30분). 형식: ?시간 ??분")
    time_input = input().strip()
    time_parts = time_input.split()
    hours = int(time_parts[0].replace('시간', ''))
    minutes = int(time_parts[1].replace('분', ''))
    total_minutes = hours * 60 + minutes
    num_songs = total_minutes // 3  # 각 노래를 3분으로 계산

    # 데이터 로드
    train_data = load_data(train_filepath)
    song_meta = load_song_meta(song_meta_filepath)

    # 입력받은 태그를 포함하는 플레이리스트 필터링
    tagged_playlists = filter_playlists(train_data, input_tag)

    # 필요한 수의 노래 추출 및 노래 정보 표시
    top_songs = get_most_common_songs(tagged_playlists, song_meta, num_songs)
    print(f"Top {num_songs} songs for a playlist of {hours} hours and {minutes} minutes tagged '{input_tag}':")
    for song_name, artists, count in top_songs:
        artist_names = ', '.join(artists)
        print(f"{song_name} by {artist_names} (Count: {count})")

if __name__ == "__main__":
    main()
