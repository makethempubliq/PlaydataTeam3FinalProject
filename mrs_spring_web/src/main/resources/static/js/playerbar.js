document.getElementById('playlist-icon').addEventListener('click', function () {
    document.getElementById('playlist-sidebar').classList.toggle('show');
});

window.onSpotifyWebPlaybackSDKReady = () => {
    var tracklistInput = document.getElementById("tracklist");
    var tracklistValue = tracklistInput.value;
    const token = document.getElementById("accesstoken").value;
    console.log("accesstoken is " + token)
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        // Device ID를 백엔드로 전송
        await fetch('/api/v1/deviceid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: device_id
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send device ID to backend');
                }
                console.log('Device ID sent successfully to backend');
            })
            .catch(error => {
                console.error(error.message);
            });

        // 활성화된 디바이스 설정
        await fetch('/api/v1/activatedevice', {
            method: 'POST'
        });

        // 음악 설정
        await fetch('/api/v1/setmusic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tracklistValue)
        });

        console.log('All tasks completed.');
    });
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('player_state_changed', ({
        position,
        duration,
        track_window: { current_track }
      }) => {
        console.log('Currently Playing', current_track);
        document.getElementById('albumCover').src = current_track.album.images[0].url;
        document.getElementById('trackTitle').textContent = current_track.name;
        document.getElementById('artistName').textContent = current_track.artists.map(artist => artist.name).join(', ');
        console.log('Position in Song', position);
        document.getElementById('position').textContent = msToMinutesSeconds(position);
        console.log('Duration of Song', duration);
        document.getElementById('duration').textContent = msToMinutesSeconds(duration);
    });

    setInterval(async () => {
        player.getCurrentState().then(state => {
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
              return;
            }
            var position = state.position;
            var duration = state.duration;
            document.getElementById('position').textContent = msToMinutesSeconds(position);
            document.getElementById('progressbar').value = position/duration*100;
        });
    }, 50);

    document.getElementById('playIcon2').onclick = function () {
        player.togglePlay();
        var heartIcon = document.getElementById("playIcon2");
        if (heartIcon.classList.contains("bi-play-circle-fill")) {
            heartIcon.classList.remove("bi-play-circle-fill");
            heartIcon.classList.add("bi-pause-circle-fill");
        } else {
            heartIcon.classList.remove("bi-pause-circle-fill");
            heartIcon.classList.add("bi-play-circle-fill");
        }
    };
    
    document.getElementById('prevIcon').onclick = function() {
        player.previousTrack();
    
    };
    
    document.getElementById('nextIcon').onclick = function() {
        player.nextTrack();
    };
    
    player.connect();
}
// HTML 요소들을 가져옵니다.
// const playlistItems = document.querySelectorAll('.playlist-sidebar .list-group-item');
// const albumArt = document.querySelector('.player-bar .album-cover');
// const trackTitleElement = document.querySelector('.player-bar .track-title');
// const artistNameElement = document.querySelector('.player-bar .artist-name');
// const controlIcons = document.querySelectorAll('.control-icons .control-icon');

// let currentIndex = 0;

// // 초기화합니다.
// updatePlayerInfo(currentIndex);

// // 플레이어 정보를 업데이트합니다.
// function updatePlayerInfo(index) {
//     const selectedPlaylistItem = playlistItems[index];
//     const trackTitle = selectedPlaylistItem.querySelector('p:nth-child(1)').textContent;
//     const artistName = selectedPlaylistItem.querySelector('p:nth-child(2)').textContent;
//     const albumArtSrc = selectedPlaylistItem.querySelector('img').src;

//     trackTitleElement.textContent = trackTitle;
//     artistNameElement.textContent = artistName;
//     albumArt.src = albumArtSrc;
// }

// // 플레이어 아이콘에 클릭 이벤트를 추가합니다.
// controlIcons[2].addEventListener('click', function () {
//     currentIndex = (currentIndex + 1) % playlistItems.length;
//     updatePlayerInfo(currentIndex);
// });

// controlIcons[0].addEventListener('click', function () {
//     currentIndex = currentIndex > 0 ? currentIndex - 1 : playlistItems.length - 1;
//     updatePlayerInfo(currentIndex);
// });

// playlistItems.forEach((item, index) => {
//     item.addEventListener('click', function () {
//         currentIndex = index;
//         updatePlayerInfo(currentIndex);
//     });
// });

// "close-player-bar" 아이콘을 가져옵니다.
const closeButton = document.getElementById('close-player-bar');

// "close-player-bar" 아이콘에 클릭 이벤트 리스너를 추가합니다.
closeButton.addEventListener('click', function () {
    // player bar와 side bar를 감춥니다.
    document.getElementById('player-bar').style.display = 'none';
    document.getElementById('playlist-sidebar').style.display = 'none';
});

function msToMinutesSeconds(ms) {
    // 1초는 1000 밀리초
    let seconds = Math.floor(ms / 1000);

    // 전체 초에서 분을 계산
    let minutes = Math.floor(seconds / 60);

    // 남은 초를 계산
    seconds = seconds % 60;

    // 두 자리 숫자로 형식을 맞추기 위해 padStart 사용
    let formattedSeconds = String(seconds).padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
}


// tracklistValue = tracklistValue.substring(1, tracklistValue.length - 1);
// tracklistInput.value = tracklistValue;

    





