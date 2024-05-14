// 플레이 아이콘에 대한 클릭 이벤트 처리
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

// 하트 아이콘에 대한 클릭 이벤트 처리

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
