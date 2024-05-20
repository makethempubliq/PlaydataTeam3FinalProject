document.getElementById("heartIcon").addEventListener("click", function () {
    var heartIcon = document.getElementById("heartIcon");
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

// 페이지 로드시 총 시간과 총 곡 수 표시
window.onload = function () {
    displayTotalDuration();
    displayTotalSongs();
};

document.getElementById("playIcon").addEventListener("click", function () {
    fetch('../templates/playerbar.html')
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
            scriptElement.src = '../static/js/playerbar.js';
            document.body.appendChild(scriptElement);
        });
});