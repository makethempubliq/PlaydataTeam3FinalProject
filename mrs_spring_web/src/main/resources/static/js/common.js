// common.js
document.addEventListener("DOMContentLoaded", function () {
    // Load playerbar.html
    fetch("playerbar.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            initializePlayerBar();
        });

    // Initialize player bar functionalities
    function initializePlayerBar() {
        // Update player bar with localStorage data
        let trackTitle = localStorage.getItem('trackTitle') || 'Track Title';
        let artistName = localStorage.getItem('artistName') || 'Artist Name';
        let albumCover = localStorage.getItem('albumCover') || 'album-cover-placeholder.jpg';

        document.getElementById('trackTitle').textContent = trackTitle;
        document.getElementById('artistName').textContent = artistName;
        document.getElementById('albumCover').src = albumCover;

        // Toggle heart icon
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

        // Initialize tooltips
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        // Toggle playlist form display
        const downloadIcon = document.getElementById("downloadIcon");
        const playlistForm = document.getElementById("playlist-form");

        if (downloadIcon && playlistForm) {
            downloadIcon.addEventListener("click", function () {
                if (playlistForm.style.display === "none" || playlistForm.style.display === "") {
                    playlistForm.style.display = "block";
                } else {
                    playlistForm.style.display = "none";
                }
            });
            playlistForm.style.display = "none";
        }

        // Handle playlist form submission
        const playlistFormElement = document.getElementById("playlist-form");
        if (playlistFormElement) {
            playlistFormElement.addEventListener("submit", function (event) {
                event.preventDefault();

                var formData = new FormData(this);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/api/v1/saveplaylist", true);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        alert("플레이리스트가 만들어졌습니다!");
                    } else {
                        alert("요청에 실패했습니다.");
                    }
                };
                xhr.send(formData);
            });
        }

        // Calculate and display total duration and total songs
        function timeToSeconds(time) {
            var parts = time.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }

        function calculateTotalDuration() {
            var durations = document.querySelectorAll('.duration');
            var totalSeconds = 0;
            durations.forEach(function (duration) {
                totalSeconds += timeToSeconds(duration.innerText);
            });
            return totalSeconds;
        }

        function displayTotalDuration() {
            var totalSeconds = calculateTotalDuration();
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            document.getElementById('totalDuration').textContent = minutes + '분 ' + seconds + '초';
        }

        function displayTotalSongs() {
            var totalSongs = document.querySelectorAll('.custom-list-group-item').length;
            document.getElementById('totalSongs').textContent = '총 ' + totalSongs + '곡,';
        }

        window.onload = function () {
            displayTotalDuration();
            displayTotalSongs();
        };

        // Load additional scripts
        document.getElementById("playIcon").addEventListener("click", function () {
            document.getElementById("player-bar").style.display = "block";
            // Load additional scripts if necessary
            fetch('/playerbar?trackdata=' + tracklistValue)
                .then(response => response.text())
                .then(html => {
                    document.body.insertAdjacentHTML('beforeend', html);

                    const linkElement = document.createElement('link');
                    linkElement.rel = 'stylesheet';
                    linkElement.href = '../static/css/playerbar.css';
                    document.head.appendChild(linkElement);

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

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const scriptElement = document.createElement('script');
                scriptElement.src = src;
                scriptElement.onload = resolve;
                scriptElement.onerror = reject;
                document.body.appendChild(scriptElement);
            });
        }
    }
});
