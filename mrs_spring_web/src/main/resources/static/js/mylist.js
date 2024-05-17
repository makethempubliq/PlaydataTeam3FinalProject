$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function confirmDelete() {
    const result = confirm("정말 삭제하시겠습니까?");
    if (result) {
        // deletePlaylist();
    } else {
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const playIcons = document.querySelectorAll('#playIcon');
    const playerBar = document.getElementById('player-bar');
    const nowPlaying = document.getElementById('now-playing');
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const closePlayerBarButton = document.getElementById('close-player-bar');

    playIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            // const playlistName = this.closest('li').querySelector('button').textContent;
            // // This is where you'd set the audio source URL dynamically if needed
            // const audioUrl = 'your-audio-file-url.mp3';

            nowPlaying.textContent = playlistName;
            audioSource.src = audioUrl;
            audioPlayer.load();
            playerBar.style.display = 'block';
        });
    });

    closePlayerBarButton.addEventListener('click', function () {
        playerBar.style.display = 'none';
        audioPlayer.pause();
    });
});
