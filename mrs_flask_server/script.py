import argparse
import json
import pandas as pd
from collections import Counter

def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def parse_str_list(str_list):
    if isinstance(str_list, list):
        return str_list
    try:
        return json.loads(str_list.replace("'", '"'))
    except json.JSONDecodeError:
        return []

def filter_playlists(data, tag_keywords):
    filtered_data = []
    for playlist in data:
        tags = parse_str_list(playlist['tags'])
        if all(tag in tags for tag in tag_keywords):
            filtered_data.append(playlist)
    return filtered_data

def load_song_meta(filepath):
    df_song = pd.read_json(filepath)
    df_song_info = df_song[['id', 'song_name', 'artist_id_basket', 'artist_name_basket', 'album_id', 'album_name']]
    song_dict = {
        int(row['id']): {
            'name': row['song_name'],
            'artists': parse_str_list(row['artist_name_basket']),
            'album_id': row['album_id'],
            'album_name': row['album_name']
        } for idx, row in df_song_info.iterrows()
    }
    return song_dict

def get_most_common_songs(filtered_data):
    song_counter = Counter()
    for playlist in filtered_data:
        songs = parse_str_list(playlist['songs'])
        song_counter.update(songs)
    return song_counter

def melon_to_spotify(melon_id_list):
    with open(r"resources/static/data/melontospotify.json", 'r', encoding='utf-8') as file:
        data = json.load(file)
    melon_to_spotify_data = {str(k): v for d in data for k, v in d.items() if v != "null"}
    spotify_id_list = [melon_to_spotify_data.get(str(id)) for id in melon_id_list if melon_to_spotify_data.get(str(id))]
    return spotify_id_list, melon_to_spotify_data

def main_recommend(input_tags, num_songs):
    train_filepath = r'resources/static/data/train.json'
    song_meta_filepath = r'resources/static/data/song_meta.json'
    

    train_data = load_data(train_filepath)
    song_meta = load_song_meta(song_meta_filepath)

    song_counter = Counter()
    
    tagged_playlists = filter_playlists(train_data, input_tags)
    song_counter.update(get_most_common_songs(tagged_playlists))

    for tag in input_tags:
        if len(song_counter) >= num_songs:
            break
        tagged_playlists = filter_playlists(train_data, [tag])
        song_counter.update(get_most_common_songs(tagged_playlists))

    most_common_songs = song_counter.most_common(num_songs)
    melon_ids = [song_id for song_id, _ in most_common_songs]

    print(melon_ids)
    spotify_ids, melon_to_spotify_data = melon_to_spotify(melon_ids)

    unique_spotify_ids = list(dict.fromkeys(spotify_ids))

    while len(unique_spotify_ids) < num_songs:
        if len(song_counter) == 0:
            break
        next_most_common = song_counter.most_common(num_songs - len(unique_spotify_ids))
        melon_ids = [song_id for song_id, _ in next_most_common]
        additional_spotify_ids, _ = melon_to_spotify(melon_ids)
        unique_spotify_ids.extend(additional_spotify_ids)
        unique_spotify_ids = list(dict.fromkeys(unique_spotify_ids))
        song_counter = Counter({k: v for k, v in song_counter.items() if k not in melon_ids})

    unique_spotify_ids = unique_spotify_ids[:num_songs]

    return unique_spotify_ids

