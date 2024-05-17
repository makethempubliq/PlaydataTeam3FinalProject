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