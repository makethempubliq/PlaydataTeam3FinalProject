function confirmDelete(playlistid) {
    const result = confirm("정말 삭제하시겠습니까?");
    if (result) {
        deletePlaylist(playlistid);
    }
}

function deletePlaylist(playlistid) {
    data = {
        "playlistId" : playlistid
    }
    fetch("/api/v1/deleteplaylist", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert("삭제되었습니다.")
        window.location.reload();
    })

    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showplaylistpage(tracks, themes, enthemes, src) {
    console.log('Recommended Tracks:');
    const tokenizedTheme = JSON.parse(themes);
    const trackUris = JSON.parse(tracks);
    const entokenizedTheme = JSON.parse(enthemes);
    // Create a URL with query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('tokenizedTheme', JSON.stringify(tokenizedTheme));
    queryParams.append('entokenizedTheme', JSON.stringify(entokenizedTheme));
    // Add recommended tracks to query parameters
    queryParams.append('recommendedtracks', JSON.stringify(trackUris));
    queryParams.append('playlistCoverSrc', src);
    // Redirect to /playlist with the track data as query parameters
    window.location.href = `/playlist?${queryParams.toString()}`;
}

