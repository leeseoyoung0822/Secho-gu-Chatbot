// help.js

document.addEventListener("DOMContentLoaded", function () {
    const helpButton = document.querySelector(".help-button");

    if (helpButton) {
        helpButton.addEventListener("click", function () {
            window.location.href = "help.html"; // Help 버튼 클릭 시 help.html로 이동
        });
    }

 
});
