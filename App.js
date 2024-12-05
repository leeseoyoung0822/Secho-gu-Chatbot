document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

    if (currentPath.includes("splash.html")) {
        initSplash();
    } else if (currentPath.includes("main.html")) {
        initMain();
    }
});

const SUPPORTED_FILE_TYPES = ["PDF", "DOCX", "DOC", "XLSX", "XLS", "HW"];

function initSplash() {
    const text = "안녕하세요 서초구청 챗봇 '서봇'입니다.<br> 무엇을 도와드릴까요?";
    const typingElement = document.getElementById("typing-text");
    const clipButton = document.querySelector(".btn-left");
    const sendButton = document.querySelector(".btn-right");
    const fileInput = document.createElement("input");
    const fileDisplay = document.getElementById("fileDisplay");
    const fileTypeSpan = fileDisplay.querySelector(".file-type");
    const errorDisplay = document.getElementById("fileError");
    const errorText = document.getElementById("fileErrorText");
    const fileNameSpan = fileDisplay.querySelector(".file-name");
    const removeFileButton = document.getElementById("removeFileButton");
    const messageInput = document.getElementById("messageInput");
    const newChatButton = document.getElementById("newChatButton");
    let i = 0;

    // 새 채팅 버튼 클릭 이벤트
    newChatButton.addEventListener("click", function () {
        // 입력 필드 초기화
        messageInput.value = "";

        // 파일 첨부 영역 초기화
        fileDisplay.classList.add("hidden");

        // 경고창 숨기기
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");

        // 채팅 영역 초기화 (옵션: 이미 보낸 메시지도 초기화)
        if (chatArea) {
            chatArea.innerHTML = ""; // 채팅 내용 초기화
        }

        // 로컬 스토리지 초기화
        localStorage.removeItem("chatData");
    });

    // 페이지 새로고침 시 경고창 숨기기
    window.addEventListener("load", function () {
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");
    });

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
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");

        if (fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const fileName = selectedFile.name;
            const fileType = fileName.split(".").pop().toUpperCase();
    
            if (SUPPORTED_FILE_TYPES.includes(fileType)) {
                // 유효한 파일 형식일 때
                fileTypeSpan.textContent = fileType;
                fileNameSpan.textContent = fileName;
    
                const reader = new FileReader();
                reader.onload = function () {
                    fileInput.dataset.fileData = reader.result; // Base64 데이터 저장
                };
                reader.readAsDataURL(selectedFile);
    
                fileDisplay.classList.remove("hidden");
                fileDisplay.style.display = "flex"; // 파일 디스플레이 표시
            } else {
                // 지원하지 않는 파일 형식일 때
                showErrorMessage("지원하지 않는 파일 형식입니다.");
            }
        } else {
            // 파일이 선택되지 않았을 때
            showErrorMessage("파일을 선택해주세요.");
        }
    });
    

    
        
    // 파일 제거 처리
    removeFileButton.addEventListener("click", function () {
        resetInputs(fileTypeSpan, fileNameSpan, fileDisplay, errorDisplay);
    });

    // 메시지 전송 처리
    sendButton.addEventListener("click", function (e) {
        e.preventDefault();
    
        const message = messageInput.value.trim();
        const fileName = fileTypeSpan.textContent ? fileNameSpan.textContent : null;
        const fileType = fileTypeSpan.textContent || null;
        const fileData = fileInput.dataset.fileData || null;
    
        // 메시지나 파일 정보가 없는 경우 경고
        if (!message && !fileName) {
            alert("메시지나 파일을 입력해주세요.");
            return;
        }
    
        // 데이터 저장 및 페이지 이동
        try {
            const chatData = { 
                message,
                fileName, 
                fileType, 
                fileData };
            localStorage.setItem("chatData", JSON.stringify(chatData)); // 데이터 저장
            console.log("데이터 저장 완료:", chatData); // 디버깅용 로그
            window.location.href = "main.html"; // main.html로 이동
        } catch (error) {
            console.error("데이터 저장 중 오류 발생:", error);
            alert("데이터 저장에 문제가 발생했습니다.");
        }
    });
    

    function resetInputs(fileTypeSpan, fileNameSpan, fileDisplay, errorDisplay) {
        fileNameSpan.textContent = "";
        fileTypeSpan.textContent = "";
        fileDisplay.style.display = "none"; // 파일 디스플레이 숨기기
        fileDisplay.classList.add("hidden");
        errorDisplay.style.display = "none"; // 오류 메시지 숨기기
        errorDisplay.classList.remove("active"); // active 클래스 제거
    }
    function showErrorMessage(message) {
        errorText.textContent = message; // 오류 메시지 설정
        errorDisplay.style.display = "flex"; // 오류 메시지 표시
        errorDisplay.classList.remove("d-none"); // 숨김 클래스 제거
        errorDisplay.classList.add("active"); // 필요하다면 active 클래스 추가
        
    }
}


function initMain() {
    const chatArea = document.getElementById("chatArea");
    const clipButton = document.getElementById("clipButton");
    const sendButton = document.getElementById("sendButton");
    const fileInput = document.createElement("input");
    const fileDisplay = document.getElementById("fileDisplay");
    const fileNameSpan = fileDisplay.querySelector(".file-name");
    const fileTypeSpan = fileDisplay.querySelector(".file-type");
    const errorDisplay = document.getElementById("fileError");
    const errorText = document.getElementById("fileErrorText");
    const messageInput = document.getElementById("messageInput");
    const newChatButton = document.getElementById("newChatButton");
    const removeFileButton = document.getElementById("removeFileButton");

    

    // 파일 제거 버튼 클릭 이벤트
    removeFileButton.addEventListener("click", function () {
        resetInputs(fileTypeSpan, fileNameSpan, fileDisplay, errorDisplay);
    });


    // 새 채팅 버튼 클릭 이벤트
    newChatButton.addEventListener("click", function () {
        // 입력 필드 초기화
        messageInput.value = "";

        // 파일 첨부 영역 초기화
        fileDisplay.classList.add("hidden");

        // 경고창 숨기기
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");

        // 채팅 영역 초기화 (옵션: 이미 보낸 메시지도 초기화)
        if (chatArea) {
            chatArea.innerHTML = ""; // 채팅 내용 초기화
        }

        // 로컬 스토리지 초기화
        localStorage.removeItem("chatData");
    });

    // 페이지 새로고침 시 경고창 숨기기
    window.addEventListener("load", function () {
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");
    });

    // 파일 입력 초기화
    fileInput.type = "file";
    fileInput.accept = "*/*";
    fileInput.style.display = "none";

    // 파일 첨부 버튼 클릭 시 파일 선택 창 열기
    clipButton.addEventListener("click", function () {
        fileInput.click();
    });

    // 파일 선택 이벤트 핸들러
    fileInput.addEventListener("change", () => {
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");

        if (fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const fileName = selectedFile.name;
            const fileType = fileName.split(".").pop().toUpperCase();
    
            if (SUPPORTED_FILE_TYPES.includes(fileType)) {
                // 유효한 파일 형식일 때
                fileTypeSpan.textContent = fileType;
                fileNameSpan.textContent = fileName;
    
                const reader = new FileReader();
                reader.onload = function () {
                    fileInput.dataset.fileData = reader.result; // Base64 데이터 저장
                };
                reader.readAsDataURL(selectedFile);
    
                fileDisplay.classList.remove("hidden");
                fileDisplay.style.display = "flex"; // 파일 디스플레이 표시
            } else {
                // 지원하지 않는 파일 형식일 때
                showErrorMessage("지원하지 않는 파일 형식입니다.");
            }
        } else {
            // 파일이 선택되지 않았을 때
            showErrorMessage("파일을 선택해주세요.");
        }
    });
    // localStorage에서 데이터 로드 및 사용자 메시지 출력
    const chatData = JSON.parse(localStorage.getItem("chatData"));

    if (chatData) {
        const { message, fileName, fileType, fileData } = chatData;

        const userBubble = createUserBubble(message, fileName, fileType, fileData);
        chatArea.appendChild(userBubble); // 사용자 버블 추가
        chatArea.scrollTop = chatArea.scrollHeight; // 스크롤 하단으로 이동
        localStorage.removeItem("chatData"); // 데이터 삭제
    }

    // 메시지 전송 처리
    sendButton.addEventListener("click", function (e) {
        e.preventDefault();
    
        const message = messageInput.value.trim();
        const fileName = fileTypeSpan.textContent ? fileNameSpan.textContent : null;
        const fileType = fileTypeSpan.textContent || null;
        const fileData = fileInput.dataset.fileData || null;
    
        // 메시지나 파일 정보가 없는 경우 경고
        if (!message && !fileName) {
            alert("메시지나 파일을 입력해주세요.");
            return;
        }
    
        // 데이터 저장 및 페이지 이동
        try {
            const chatData = { 
                message,
                fileName, 
                fileType, 
                fileData };
            localStorage.setItem("chatData", JSON.stringify(chatData)); // 데이터 저장
            console.log("데이터 저장 완료:", chatData); // 디버깅용 로그
            window.location.href = "main.html"; // main.html로 이동
        } catch (error) {
            console.error("데이터 저장 중 오류 발생:", error);
            alert("데이터 저장에 문제가 발생했습니다.");
        }
    });


   
    // 사용자 메시지 버블 생성 함수
    function createUserBubble(message, fileName, fileType, fileData) {
        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble user-message";

        if (fileName) {
            // 파일 디스플레이 영역
            const fileBubble = document.createElement("div");
            fileBubble.className = "file-bubble";

            // 파일 아이콘
            const fileIcon = document.createElement("img");
            fileIcon.src = "file.png"; // 파일 아이콘 경로
            fileIcon.alt = "File Icon";

            // 파일 정보 컨테이너 (file-info)
            const fileInfo = document.createElement("div");
            fileInfo.className = "file-info";


            // 파일 이름 텍스트
            const fileNameElement = document.createElement("span");
            fileNameElement.textContent = fileName;
            fileNameElement.className = "file-name";

            // 파일 형식 텍스트
            const fileTypeElement = document.createElement("span");
            fileTypeElement.textContent = `(${fileType})`;
            fileTypeElement.className = "file-type";
            
            /*
            // 다운로드 링크
            if (fileData) {
                const downloadLink = document.createElement("a");
                downloadLink.href = fileData; // Base64 데이터
                downloadLink.download = fileName; // 다운로드 파일 이름
                downloadLink.textContent = "다운로드";
                downloadLink.className = "file-download-link";
                fileBubble.appendChild(downloadLink);
            }*/

            // 파일 디스플레이 요소 추가
            fileBubble.appendChild(fileIcon);
            fileBubble.appendChild(fileInfo);

            fileBubble.appendChild(fileNameElement);
            fileBubble.appendChild(fileTypeElement);

            userBubble.appendChild(fileBubble);
        }

        // 메시지 텍스트 추가
        if (message) {
            const messageText = document.createElement("p");
            messageText.textContent = message;
            userBubble.appendChild(messageText);
        }

        return userBubble;
    }

    function resetInputs(fileTypeSpan, fileNameSpan, fileDisplay, errorDisplay) {
        fileNameSpan.textContent = "";
        fileTypeSpan.textContent = "";
        fileDisplay.style.display = "none"; // 파일 디스플레이 숨기기
        fileDisplay.classList.add("hidden");
        errorDisplay.style.display = "none"; // 오류 메시지 숨기기
        errorDisplay.classList.remove("active"); // active 클래스 제거
    }
    function showErrorMessage(message) {
        errorText.textContent = message; // 오류 메시지 설정
        errorDisplay.style.display = "block"; // 오류 메시지 표시
        errorDisplay.classList.add("active"); // 필요하다면 active 클래스 추가
    }


}
