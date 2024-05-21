
document.getElementById("playIcon").addEventListener("click", function () {
    var playIcon = document.getElementById("playIcon");
    if (playIcon.classList.contains("bi-play-circle")) {
        playIcon.classList.remove("bi-play-circle");
        playIcon.classList.add("bi-pause-circle");
    } else {
        playIcon.classList.remove("bi-pause-circle");
        playIcon.classList.add("bi-play-circle");
    }
});

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

