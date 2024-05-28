// 전역 변수로 player를 선언합니다.
let player;

// Spotify Web Playback SDK가 준비되면 호출되는 함수
window.onSpotifyWebPlaybackSDKReady = () => {
    var tracklistInput = document.getElementById("tracklist");
    var tracklistValue = tracklistInput.value;
    const token = document.getElementById("accesstoken").value;
    console.log("accesstoken is " + token);

    // player 변수에 값을 할당합니다.
    player = new Spotify.Player({
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

    document.getElementById('prevIcon').onclick = function () {
        player.previousTrack();

    };

    document.getElementById('nextIcon').onclick = function () {
        player.nextTrack();
    };

    player.connect();
}

// "close-player-bar" 아이콘을 가져옵니다.
const closeButton = document.getElementById('close-player-bar');

// "close-player-bar" 아이콘에 클릭 이벤트 리스너를 추가합니다.
closeButton.addEventListener('click', function () {
    // player bar와 side bar를 감춥니다.
    document.getElementById('player-bar').style.display = 'none';
    document.getElementById('playlist-sidebar').style.display = 'none';

    // 재생 중인 음악을 일시정지합니다.
    player.pause();

    // 재생 중인 음악과 플레이리스트를 모두 초기화합니다.
    document.getElementById('albumCover').src = '';
    document.getElementById('trackTitle').textContent = '';
    document.getElementById('artistName').textContent = '';
    document.getElementById('position').textContent = '0:00';
    document.getElementById('duration').textContent = '0:00';
    document.getElementById('progressbar').value = 0;

    // 재생목록을 초기화합니다.
    document.getElementById("tracklist").value = '';

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

document.getElementById('playIcon2').onclick = async function () {
    // 트랙리스트를 다시 불러옵니다.
    var tracklistInput = document.getElementById("tracklist");
    var tracklistValue = tracklistInput.value;

    // 음악 설정
    await fetch('/api/v1/setmusic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tracklistValue)
    });

    // 트랙리스트를 설정한 후 플레이어를 다시 연결합니다.
    player.connect();
};

// tracklistValue = tracklistValue.substring(1, tracklistValue.length - 1);
// tracklistInput.value = tracklistValue;


