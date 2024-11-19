document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

    if (currentPath.includes("splash.html")) {
        initSplash();
    } else if (currentPath.includes("main.html")) {
        initMain();
    }
});

function initSplash() {
    const text = "안녕하세요 서초구청 챗봇 '서봇'입니다.<br> 무엇을 도와드릴까요?";
    const typingElement = document.getElementById("typing-text");
    const clipButton = document.querySelector(".btn-left");
    const sendButton = document.querySelector(".btn-right");
    const fileInput = document.createElement("input");
    const fileDisplay = document.getElementById("fileDisplay");
    const fileTypeSpan = fileDisplay.querySelector(".file-type");
    const fileNameSpan = fileDisplay.querySelector(".file-name");
    const removeFileButton = document.getElementById("removeFileButton");
    const messageInput = document.getElementById("messageInput");
    let i = 0;

    // 타이핑 애니메이션
    function typeWriter() {
        if (i < text.length) {
            if (text.charAt(i) === "<") {
                const endIndex = text.indexOf(">", i);
                typingElement.innerHTML = text.substring(0, i) + text.substring(i, endIndex + 1);
                i = endIndex + 1;
            } else {
                typingElement.innerHTML = text.substring(0, i + 1);
                i++;
            }
            setTimeout(typeWriter, 100);
        }
    }
    typingElement.innerHTML = "&nbsp;<br>&nbsp;";
    typeWriter();

    // 파일 입력 초기화
    fileInput.type = "file";
    fileInput.accept = "*/*";
    fileInput.style.display = "none";

    // Clip 버튼 클릭 이벤트
    clipButton.addEventListener("click", function () {
        fileInput.click();
    });

    // 파일 선택 처리
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const fileName = selectedFile.name;
            const fileType = fileName.split(".").pop().toUpperCase();

            fileTypeSpan.textContent = fileType;
            fileNameSpan.textContent = fileName;

            fileDisplay.classList.remove("hidden");
            fileDisplay.style.display = "flex";
            messageInput.style.marginTop = "10px";
        } else {
            resetFileDisplay();
        }
    });

    // 파일 제거 처리
    removeFileButton.addEventListener("click", resetFileDisplay);

    // 메시지 전송 처리
    sendButton.addEventListener("click", function (e) {
        e.preventDefault();

        const message = messageInput.value.trim();
        const fileName = fileTypeSpan.textContent ? fileNameSpan.textContent : null;
        const fileType = fileTypeSpan.textContent || null;

        if (message || fileName) {
            const chatData = { message, fileName, fileType };
            localStorage.setItem("chatData", JSON.stringify(chatData));
            window.location.href = "main.html";
        } else {
            alert("메시지나 파일을 입력해주세요.");
        }
    });

    // 파일 디스플레이 초기화 함수
    function resetFileDisplay() {
        fileInput.value = "";
        fileTypeSpan.textContent = "";
        fileNameSpan.textContent = "";
        fileDisplay.classList.add("hidden");
        fileDisplay.style.display = "none";
        messageInput.style.marginTop = "0";
    }
}


function initMain() {
    const chatArea = document.getElementById("chatArea");
    const clipButton = document.getElementById("clipButton");
    const sendButton = document.getElementById("sendButton");
    const fileInput = document.createElement("input");
    const fileDisplay = document.getElementById("fileDisplay");
    const fileNameSpan = document.getElementById("fileDisplay").querySelector(".file-name");
    const fileTypeSpan = fileDisplay.querySelector(".file-type");
    const messageInput = document.getElementById("messageInput");

    // 파일 입력 초기화
    fileInput.type = "file";
    fileInput.accept = "*/*";
    fileInput.style.display = "none";

    // 파일 첨부 버튼 클릭 시 파일 선택 창 열기
    clipButton.addEventListener("click", function () {
        fileInput.click();
    });

    // 파일 선택 이벤트 핸들러
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const fileName = selectedFile.name;
            const fileType = fileName.split(".").pop().toUpperCase(); 

            fileNameSpan.textContent = fileName; // 파일 이름 표시
            fileTypeSpan.textContent = fileType;
            

            fileDisplay.classList.remove("hidden");
            fileDisplay.style.display = "flex"; // 레이아웃 표시
            messageInput.style.marginTop = "10px"; // 메시지 입력창 위치 조정
        } else {
            resetInputs(); // 파일 선택 초기화
        }
    });

    // localStorage에서 데이터 로드 및 사용자 메시지 출력
    const chatData = JSON.parse(localStorage.getItem("chatData"));
    if (chatData) {
        const { message, fileName } = chatData; // 파일명만 전달
        const userBubble = createUserBubble(message, fileName);
        chatArea.appendChild(userBubble);
        chatArea.scrollTop = chatArea.scrollHeight;
        localStorage.removeItem("chatData");
    }

    sendButton.addEventListener("click", function (e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        const fileName = fileNameSpan.textContent || null; // 파일 이름만 전달

        if (message || fileName) {
            const userBubble = createUserBubble(message, fileName);
            chatArea.appendChild(userBubble);
            chatArea.scrollTop = chatArea.scrollHeight;

            resetInputs();
        } else {
            alert("메시지나 파일을 입력해주세요.");
        }
    });

    // 사용자 메시지 버블 생성 함수
    function createUserBubble(message, fileName) {
        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble user-message";

        if (fileName) {
            const fileDisplayClone = document.createElement("div");
            fileDisplayClone.className = "fileDisplay";
            fileDisplayClone.style.display = "flex";

            const fileNameElement = document.createElement("span");
            fileNameElement.className = "file-name";
            fileNameElement.textContent = fileName; // 파일 이름만 표시

            fileDisplayClone.appendChild(fileNameElement);

            userBubble.appendChild(fileDisplayClone);
        }

        if (message) {
            const messageText = document.createElement("p");
            messageText.textContent = message;
            messageText.style.marginTop = "10px";
            userBubble.appendChild(messageText);
        }

        return userBubble;
    }

    function resetInputs() {
        fileInput.value = "";
        fileNameSpan.textContent = "";
        fileDisplay.style.display = "none";
        messageInput.style.marginTop = "0";
    }
}
