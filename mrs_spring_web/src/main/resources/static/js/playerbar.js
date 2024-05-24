document.getElementById('playlist-icon').addEventListener('click', function () {
    document.getElementById('playlist-sidebar').classList.toggle('show');
});

// HTML 요소들을 가져옵니다.
const playlistItems = document.querySelectorAll('.playlist-sidebar .list-group-item');
const albumArt = document.querySelector('.player-bar .album-cover');
const trackTitleElement = document.querySelector('.player-bar .track-title');
const artistNameElement = document.querySelector('.player-bar .artist-name');
const controlIcons = document.querySelectorAll('.control-icons .control-icon');

let currentIndex = 0;

// 초기화합니다.
updatePlayerInfo(currentIndex);

// 플레이어 정보를 업데이트합니다.
function updatePlayerInfo(index) {
    const selectedPlaylistItem = playlistItems[index];
    const trackTitle = selectedPlaylistItem.querySelector('p:nth-child(1)').textContent;
    const artistName = selectedPlaylistItem.querySelector('p:nth-child(2)').textContent;
    const albumArtSrc = selectedPlaylistItem.querySelector('img').src;

    trackTitleElement.textContent = trackTitle;
    artistNameElement.textContent = artistName;
    albumArt.src = albumArtSrc;
}

// 플레이어 아이콘에 클릭 이벤트를 추가합니다.
controlIcons[2].addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % playlistItems.length;
    updatePlayerInfo(currentIndex);
});

controlIcons[0].addEventListener('click', function () {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : playlistItems.length - 1;
    updatePlayerInfo(currentIndex);
});

playlistItems.forEach((item, index) => {
    item.addEventListener('click', function () {
        currentIndex = index;
        updatePlayerInfo(currentIndex);
    });
});

// "close-player-bar" 아이콘을 가져옵니다.
const closeButton = document.getElementById('close-player-bar');

// "close-player-bar" 아이콘에 클릭 이벤트 리스너를 추가합니다.
closeButton.addEventListener('click', function () {
    // player bar와 side bar를 감춥니다.
    document.getElementById('player-bar').style.display = 'none';
    document.getElementById('playlist-sidebar').style.display = 'none';
});

document.getElementById("playIcon").addEventListener("click", function () {
    var heartIcon = document.getElementById("playIcon");
    if (heartIcon.classList.contains("bi-play-circle-fill")) {
        heartIcon.classList.remove("bi-play-circle-fill");
        heartIcon.classList.add("bi-pause-circle-fill");
    } else {
        heartIcon.classList.remove("bi-pause-circle-fill");
        heartIcon.classList.add("bi-play-circle-fill");
    }
});

// player.js 파일 내부

// document.addEventListener('DOMContentLoaded', function () {
//     // DOMContentLoaded 이벤트가 발생하면 실행될 코드
// });

