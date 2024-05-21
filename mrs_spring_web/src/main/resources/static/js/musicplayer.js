function msToMinutesSeconds(ms) {
    // 1초는 1000 밀리초
    let seconds = Math.floor(ms / 1000);

    // 전체 초에서 분을 계산
    let minutes = Math.floor(seconds / 60);

    // 남은 초를 계산
    seconds = seconds % 60;

    // 두 자리 숫자로 형식을 맞추기 위해 padStart 사용
    let formattedSeconds = String(seconds).padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
}