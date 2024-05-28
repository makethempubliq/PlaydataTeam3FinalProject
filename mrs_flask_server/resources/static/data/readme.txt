멜론 데이터셋 다운로드 및 이용에 따른 주의사항

본 데이터셋 다운로드 및 이용을 위해서는 반드시 아래 주의사항을 확인하여야 합니다.

카카오 엔터테인먼트는 데이터셋에 대한 소유자로 정당한 권리를 가지고 있습니다.
본 데이터셋은 비영리 연구 목적으로 공증된 관행에 합치되는 방법으로만 이용할 수 있습니다.
연구, 논문에 데이터를 이용/인용할 경우 'Kakao Entertainment, melon (www.melon.com) ’와 같이 반드시 출처를 포함하여 표기하여야 하며 
제공되는 데이터셋의 무단전재 및 재배포를 금지합니다. 

카카오 엔터테인먼트는 데이터셋을 다른 목적으로 사용함에 따른 정확성, 적합성, 유효성을 보증하지 않습니다.
데이터셋 사용에 따른 책임은 전적으로 이용자에게 있으며, 카카오 엔터테인먼트는 그 사용에 따른 책임으로 면책됩니다.
본 데이터셋 다운로드 및 이용에 따른 주의사항을 위반하거나 데이터셋의 다운로드 및 이용 과정에서 카카오 엔터테인먼트에게 손해가 발생할 경우, 
카카오 엔터테인먼트에게 해당 손해를 배상할 책임이 있습니다.

본 주의사항을 읽고 이에 동의를 한 경우에만 데이터셋 다운로드 및 이용이 가능합니다.

데이터셋 설명
    song_meta.json: 곡 메타데이터

        총 707,989개의 곡에 대한 메타데이터가 수록되어 있습니다.
        개발 데이터와 평가 데이터에 수록된 모든 곡에 대한 메타데이터가 포함되어 있습니다.
        필드 설명
            _id: 곡 ID
            album_id: 앨범 ID
            artist_id_basket: 아티스트 ID 리스트
            artist_name_basket: 아티스트 리스트
            song_name: 곡 제목
            song_gn_gnr_basket: 곡 장르 리스트
            song_gn_dtl_gnr_basket: 곡 세부 장르 리스트
            issue_date: 발매일
        메타데이터의 모든 정보는 저작권자의 비공개 여부 전환, 곡 삭제, 메타데이터 수정 등으로 유효하지 않거나 변동될 수 있습니다.

    genre_gn_all.json:
        곡 메타데이터에 수록된 장르에 대한 정보입니다. 위 song_meta.json 에서 song_gn_gnr_basket 과 song_gn_dtl_gnr_basket 에 들어가는 정보들에 대한 메타데이터입니다.

    train.json:
        모델 학습용 파일로, 115,071개 플레이리스트의 원본 데이터가 수록되어 있습니다.
        필드 설명
            id: 플레이리스트 ID
            plylst_title: 플레이리스트 제목
            tags: 태그 리스트
            songs: 곡 리스트
            like_cnt: 좋아요 개수
            updt_date: 수정 날짜

    val.json:
        공개 리더보드용 문제 파일로, 23,015개 플레이리스트에 대한 문제가 수록되어 있습니다. 모든 데이터가 수록되어있는 train 파일과는 다르게, 곡과 태그의 일부가 수록되어 있습니다.
        필드 설명
            id: 플레이리스트 ID
            plylst_title: 플레이리스트 제목
            tags: 태그 리스트
            songs: 곡 리스트
            like_cnt: 좋아요 개수
            updt_date: 수정 날짜

    test.json:
        파이널 리더보드용 문제 파일로, 10,740개 플레이리스트에 대한 문제가 수록되어 있습니다. 모든 데이터가 수록되어있는 train 파일과는 다르게, 곡과 태그의 일부가 수록되어 있습니다.
        필드 설명
            id: 플레이리스트 ID
            plylst_title: 플레이리스트 제목
            tags: 태그 리스트
            songs: 곡 리스트
            like_cnt: 좋아요 개수
            updt_date: 수정 날짜

    arena_mel_{0~39}.tar
        곡에 대한 mel-spectrogram 데이터를 담고있는 파일입니다. 위에 있는 파일들에서 등장하는 각 곡 ID마다 npy 파일 1개가 배정되어있습니다. numpy로 다음과 같이 로드할 수 있습니다.

        import numpy as np

        mel = np.load("0.npy")

        곡 ID는 0~707988 까지 배정되어 있으며, 곡ID.npy 의 파일 이름을 가지고 있습니다. 파일의 갯수가 많기 때문에, 각 npy 파일은 각각 {floor(ID / 1000)}/ 폴더 아래에 들어가있습니다. 예를 들어 곡 ID가 415263인 파일의 경우 415/415263.npy 로, 곡 ID가 53712인 경우 53/53712.npy 에 존재합니다.


---


Precautions Regarding the Download and Use of the Melon Dataset

Before proceeding with the download and utilization of this dataset, it is crucial to review and comply with the following precautions carefully:

Kakao Entertainment is the lawful owner of the dataset and possesses all the necessary rights.
The dataset is intended solely for non-profit research purposes and should be utilized in accordance with established industry practices.
When utilizing or referencing the data for research or scholarly papers, it is mandatory to include the appropriate attribution as follows: "Kakao Entertainment, melon (www.melon.com)." Unauthorized reproduction or redistribution of the dataset is strictly prohibited.

Please be aware that Kakao Entertainment does not guarantee the accuracy, suitability, or validity of the dataset for purposes other than those specified.
The user assumes full responsibility for the usage of the dataset, and Kakao Entertainment shall not be held accountable for any consequences or liabilities arising from its use.
In case of any violation of the precautions regarding the download and use of this dataset, or if any damages occur to Kakao Entertainment during the process, the user shall be held responsible for compensating Kakao Entertainment for such damages.

By confirming your understanding and agreement to the above precautions, you may proceed with downloading and utilizing the dataset.

Dataset Description

Melon Playlist Dataset 
Melon Playlist Dataset is composed of playlists provided by Melon, the service of Kakao Corporation, and made public to solve playlist continuation. This dataset contains 148,826 playlists composed of 649,091 unique songs and mel-spectrogram data for each song. The included playlists are the listed item in the Melon DJ Playlist service provided by Melon. In addition, Melon DJ Playlist consists of playlists both made by experts contracting with us in advance for quality assurance and filtered by the company’s quality standard among those submitted by Melon users who want to put on the Melon DJ Playlist. Each playlist contains songs and multiple sets of tags (included in the 30,652 unique tags) assigned by the playlist creator, along with its title.

    Playlist Included
    For setting contest questions, we will provide the entire playlist data separately as train.json composed of 115,071 playlists, val.jason composed of 23,015 playlists, and test.jason composed of 10,740 playlists. Unlike train.jason, test.jason and train.jason have some of the songs and tags in their playlists masked for the submission of answers.

        Field Description
            id: Playlist  ID 
            plylst_title: Playlist title 
            tags: tag list 
            songs: song list 
            like_cnt: like count 
            updt_date: update date 

Mel-Spectrogram Included 
Mel-spectrogram data are saved as a ‘songID.npy’ file name with the file extension npy. A number from 0 to 707988 is assigned as song ID, and each file is allocated to and stored in the {floor(ID / 1000)}/ directory. For example, the song with ID 415263 is saved as 415/415263.npy. The 2.1b.dev677 version of Essentia library was used to extract each mel-spectrogram.  mel-spectrogram was calculated in the use of segments of a song’s 20~50 second-interval to reduce the 16Khz sample size rate, 512 frame size, 256 hop size, Hann window function, and data size and employed 48 mel-bands resolution so that Melon Playlist Dataset can contain about 240GB data.

Meta-Data Included 
Melon Playlist Dataset provides song_meta.jason, the song metadata saved in a separate json file format, and genre_gn_all.json, the mapping table for genre included in the song metadata. song_meta.jason has metadata for a total of 707,989 songs, including all songs in train.json, val.json, and test.json. The field description included is as follows.

    Field Description
         _id: song ID 
        album_id: album ID 
        artist_id_basket: artist ID list 
        artist_name_basket: artist list 
        song_name: song title 
        song_gn_gnr_basket: song genre list 
        song_gn_dtl_gnr_basket: song detailed genre list 
        issue_date: issue date 

* All information in the metadata may be invalid or subject to change due to the copyright holder’s privacy conversion, song deletion, metadata modification, and the like. 

genre_gn_all.json contains a total of 254 genre codes, including genre information for 30 major category genre codes (included in song_gn_gnr_basket) and 224 detailed category genre codes (included in song_gn_gnr_baset).
