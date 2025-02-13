document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.reset').addEventListener('click', function () {
        document.querySelector('#phoneNumber').value = '';
    });
});