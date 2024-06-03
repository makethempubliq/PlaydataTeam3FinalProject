$(document).ready(function () {
    // 대분류 버튼 클릭 시 해당 소분류 버튼을 보여줍니다
    $('.topic-btn').click(function () {
        let mainCategory = $(this).data('topic');
        // 대분류 버튼을 클릭하면 해당 대분류의 소분류 버튼을 동적으로 생성합니다
        showSubTopics(mainCategory);
        // 선택한 대분류 버튼에 대한 스타일을 변경합니다
        $('.topic-btn').removeClass('btn-selected');
        $(this).addClass('btn-selected');
    });

    // 폼 제출 시 선택한 정보 확인
    $('#topicForm').submit(function (event) {
        event.preventDefault(); // 기본 제출 동작 방지
        let mainCategory = $('.btn-selected').data('topic');
        let subCategory = $('.subtopic-btn.btn-selected').data('subtopic');
        // 선택한 정보를 여기에서 처리하거나 서버로 전달할 수 있습니다
        // 여기에 필요한 코드를 작성하세요
    });
});

function showSubTopics(mainCategory) {
    let subTopics = [];
    // 대분류에 따라 소분류를 동적으로 변경합니다
    if (mainCategory === '감정') {
        subTopics = ['사랑', '우울', '행복'];
    } else if (mainCategory === '계절') {
        subTopics = ['봄', '여름', '가을', '겨울'];
    } else if (mainCategory === '운동') {
        subTopics = ['러닝', '요가', '근력운동'];
    } else if (mainCategory === '여행') {
        subTopics = ['바다', '산']
    }
    // 소분류 버튼을 보여줍니다
    let subTopicsHtml = ''; // let으로 변경
    subTopics.forEach(function (subTopic) {
        subTopicsHtml += '<button type="button" class="btn btn-outline-primary btn-block subtopic-btn" data-subtopic="' + subTopic + '">' + subTopic + '</button>';
    });
    $('#selectedSubTopics').html(subTopicsHtml);

    // 소분류 버튼 클릭 시 선택 상태를 토글하고 스타일을 변경합니다
    $('.subtopic-btn').click(function () {
        $('.subtopic-btn').removeClass('btn-selected');
        $(this).toggleClass('btn-selected');
    });
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("themesubmit").addEventListener("click", function () {
        const inputtext = document.getElementById("themeinput").value;
        const hour = parseInt(document.getElementById("hour").value);
        const minute = parseInt(document.getElementById("minute").value);

        const totalduration = hour * 60 + minute;

        const data = {
            inputText: inputtext,
            totalDuration: totalduration
        };

        fetch("http://localhost:5000/api/v1/flask/themeselect", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);

                // Extract the necessary data for the second request
                const tokenizedTheme = data.tokenizedTheme;
                const trackCounts = data.trackCounts;

                // Create the data object for the second request
                const trackData = {
                    tokenizedTheme: tokenizedTheme,
                    trackCounts: trackCounts
                };

                // Send the second POST request to get recommended tracks
                return fetch("http://localhost:5000/api/v1/flask/gettracks", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trackData)
                });
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
                window.location.href = `/playlist?${queryParams.toString()}`;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    );
});
