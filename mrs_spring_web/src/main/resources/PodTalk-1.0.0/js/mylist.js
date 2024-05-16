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