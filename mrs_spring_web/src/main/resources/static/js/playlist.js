document.getElementById("heartIcon").addEventListener("click", function () {
    var heartIcon = document.getElementById("heartIcon");
    const tracklist = document.getElementById("tracklist2").value;
    const themes = document.getElementById("themes").value;
    const enthemes = document.getElementById("enthemes").value;
    const totalDuration = document.getElementById("totalDuration").textContent;
    const playlistTrackCount = document.querySelectorAll('.custom-list-group-item').length;
    const playlistCoverSrc = document.getElementById("playlistcover").src;

    const data = {
        "playlistTracks" : tracklist,
        "playlistTracksCount" : playlistTrackCount,
        "playlistDuration" : totalDuration,
        "playlistThemes" : themes,
        "playlistCoverSrc" : playlistCoverSrc,
        "playlistEnThemes" : enthemes
    };
    fetch("/api/v1/likeplaylist", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
   })
   .then(alert("플레이리스트가 만들어졌습니다!"));
    if (heartIcon.classList.contains("bi-heart")) {
        heartIcon.classList.remove("bi-heart");
        heartIcon.classList.add("bi-heart-fill");
    } else {
        heartIcon.classList.remove("bi-heart-fill");
        heartIcon.classList.add("bi-heart");
    }
});


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

document.addEventListener("DOMContentLoaded", function () {
    const downloadIcon = document.getElementById("downloadIcon");
    const playlistForm = document.getElementById("playlist-form");

    downloadIcon.addEventListener("click", function () {

        if (playlistForm.style.display === "none" || playlistForm.style.display === "") {
            playlistForm.style.display = "block";
        } else {
            playlistForm.style.display = "none";
        }
    });

    playlistForm.style.display = "none";
});




// 시간을 초 단위로 변환하는 함수
function timeToSeconds(time) {
    var parts = time.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// 각 요소의 시간을 가져와 총 시간을 계산하는 함수
function calculateTotalDuration() {
    var durations = document.querySelectorAll('.duration');
    var totalSeconds = 0;
    durations.forEach(function (duration) {
        totalSeconds += timeToSeconds(duration.innerText);
    });
    return totalSeconds;
}

// 총 시간을 표시하는 함수
function displayTotalDuration() {
    var totalSeconds = calculateTotalDuration();
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    document.getElementById('totalDuration').textContent = minutes + '분' + ' ' + seconds + '초';
}

// 총 곡 수를 표시하는 함수
function displayTotalSongs() {
    var totalSongs = document.querySelectorAll('.custom-list-group-item').length;
    document.getElementById('totalSongs').textContent = '총 ' + totalSongs + '곡,';
}


document.getElementById("playlist-form").addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출을 중단하여 페이지 이동을 막습니다.

    // form 데이터 가져오기
    var formData = new FormData(this);

    // AJAX 요청 보내기
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/v1/saveplaylist", true);
    xhr.onload = function () {
        // 요청 완료 후 처리할 작업
        if (xhr.status === 200) {
            // 요청이 성공하면 알림을 표시하거나 다른 작업을 수행할 수 있습니다.
            alert("플레이리스트가 만들어졌습니다!");
        } else {
            // 요청이 실패한 경우에 대한 처리
            alert("요청에 실패했습니다.");
        }
    };
    xhr.send(formData); // 폼 데이터를 서버로 전송합니다.
});

// 페이지 로드시 총 시간과 총 곡 수 표시
window.onload = function () {
    displayTotalDuration();
    displayTotalSongs();
};

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script');
        scriptElement.src = src;
        scriptElement.onload = resolve;
        scriptElement.onerror = reject;
        document.body.appendChild(scriptElement);
    });
}

document.getElementById("playIcon").addEventListener("click", function () {
    fetch('/playerbar?trackdata=' + tracklistValue)
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            // HTML에 연결된 CSS 파일을 가져와 삽입합니다.
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = '../static/css/playerbar.css';
            document.head.appendChild(linkElement);


            // HTML에 연결된 JavaScript 파일을 가져와 실행합니다.
            const scriptElement = document.createElement('script');
            const spotifyplayer = document.createElement('script');

            loadScript('../static/js/playerbar.js')
                .then(() => loadScript('https://sdk.scdn.co/spotify-player.js'))
                .then(() => {
                    console.log('All scripts loaded successfully.');
                })
                .catch(error => {
                    console.error('Error loading scripts:', error);
                });
        });
});

