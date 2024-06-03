function presettheme (tags) {

    // Create the data object for the second request
    const trackData = {
        tokenizedTheme: tags,
        trackCounts: 10
    };

    // Send the second POST request to get recommended tracks
    fetch("http://localhost:5000/api/v1/flask/gettracks", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackData)
    })
    .then(response => response.json())
    .then(trackData => {
        console.log('Recommended Tracks:', trackData);
        const tokenizedTheme = trackData.tokenizedTheme;
        const trackUris = trackData.trackUris;
        const entokenizedTheme = trackData.entokenizedTheme
        // Create a URL with query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('tokenizedTheme', JSON.stringify(tokenizedTheme));
        queryParams.append('entokenizedTheme', JSON.stringify(entokenizedTheme));
        // Add recommended tracks to query parameters
        queryParams.append('recommendedtracks', JSON.stringify(trackUris));
        // Redirect to /playlist with the track data as query parameters
        window.location.href = `/user/playlist?${queryParams.toString()}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}