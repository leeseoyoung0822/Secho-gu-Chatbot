document.addEventListener("DOMContentLoaded", function () {
    // 타이핑 애니메이션 텍스트
    const text = "안녕하세요 서초구청 챗봇 '서봇'입니다.<br> 무엇을 도와드릴까요?";
    const typingElement = document.getElementById("typing-text");

    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            if (text.charAt(i) === "<") {
                // 줄바꿈 태그 처리
                const endIndex = text.indexOf(">", i);
                typingElement.innerHTML = text.substring(0, i) + text.substring(i, endIndex + 1);
                i = endIndex + 1;
            } else {
                // 일반 문자 추가
                typingElement.innerHTML = text.substring(0, i + 1);
                i++;
            }
            setTimeout(typeWriter, 100); // 타이핑 속도
        }
    }
    // 말풍선의 초기 크기를 유지하기 위해 기본 텍스트 추가
    typingElement.innerHTML = "&nbsp;<br>&nbsp;";


    typeWriter();

    // Send 버튼 클릭 이벤트
    const sendButton = document.querySelector(".btn-right");
    sendButton.addEventListener("click", function () {
        const userInput = document.querySelector(".form-control").value;
        console.log("User Message:", userInput);
        // 메시지 전송 후 페이지 전환
        window.location.href = "main.html";
    });

    // Clip 버튼 클릭 이벤트
    const clipButton = document.querySelector(".btn-left");
    clipButton.addEventListener("click", function () {
        console.log("Clip 버튼 클릭됨");
        // 파일 업로드 이벤트 추가 가능
    });
});
