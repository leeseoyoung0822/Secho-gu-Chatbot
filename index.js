document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");

    // loadPage 함수
    window.loadPage = function (url, cssFile, cssId) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(`${url} 로드 성공`);
                mainContent.innerHTML = xhr.responseText;
                window.currentPage = url; // 현재 페이지 설정

                // 기존 CSS 제거
                if (cssId) {
                    const existingCSS = document.getElementById(cssId);
                    if (existingCSS) {
                        existingCSS.parentNode.removeChild(existingCSS);
                        console.log(`${cssId} CSS 제거됨`);
                    }
                }

                // 새로운 CSS 로드
                if (cssFile && cssId) {
                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = cssFile;
                    link.id = cssId;
                    document.head.appendChild(link);
                    console.log(`${cssFile} CSS 로드됨`);
                }

                // 페이지 별 초기화 함수 호출
                if (url === "splash.html") {
                    console.log("Splash 이벤트 초기화 호출됨");
                    initSplashEvents();
                } else if (url === "main.html") {
                    console.log("Main 이벤트 초기화 호출됨");
                    initMainEvents();
                } else if (url === "login.html") {
                    console.log("Login 이벤트 초기화 호출됨");
                    initLoginEvents();
                } else if (url === "signup.html") {
                    console.log("Signup 이벤트 초기화 호출됨");
                    initSignupEvents();
                } else if (url === "faq.html") {
                    console.log("FAQ 이벤트 초기화 호출됨");
                    initFaqEvents();
                }
                else if (url === "issue.html") {
                    console.log("서초이슈 초기화 호출됨");
                    initIssueEvents();
                }
                else if (url === "notice.html") {
                    console.log("공지사항 초기화 호출");
                    initNoticeEvents();
                }

                // 헤더 초기화 함수 호출하여 로그인 상태에 따른 헤더 업데이트
                initHeader();
            } else {
                console.error(`Failed to load ${url}: ${xhr.statusText}`);
            }
        };

        xhr.onerror = function () {
            console.error(`Error occurred while loading ${url}`);
        };

        xhr.send();
    }

    // 헤더 로드 및 초기화
    fetch("header.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("header-container").innerHTML = html;

        // 헤더 초기화 함수 호출
        initHeader();
      })
      .catch(error => console.error("header.html 로드 실패:", error));

    // 사이드바 로드 및 초기화
    fetch("sidebar.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;

        // 사이드바 초기화 함수 호출
        initSidebar();
      })
      .catch(error => console.error("sidebar.html 로드 실패:", error));

    // 초기 페이지 로드 시 splash.html 로드
    window.loadPage("splash.html", "splash.css", "page-style");

    const SUPPORTED_FILE_TYPES = ["PDF", "DOCX", "DOC", "XLSX", "XLS", "HW"];

    // 공통 파일 핸들링 함수
    function handleFileSelection(file) {
        const fileDisplay = document.getElementById("fileDisplay");
        if (!fileDisplay) {
            console.error("fileDisplay 요소를 찾을 수 없습니다.");
            return;
        }

        // 파일 형식 검증
        const fileType = file.name.split(".").pop().toUpperCase();
        if (!SUPPORTED_FILE_TYPES.includes(fileType)) {
            alert("지원하지 않는 파일 형식입니다.");
            return;
        }

        // 파일 크기 검증 (4MB 이하)
        const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
        if (file.size > MAX_FILE_SIZE) {
            alert("파일 크기가 너무 큽니다. 4MB 이하의 파일을 선택해주세요.");
            return;
        }

        // 파일 정보 설정
        const fileTypeSpan = fileDisplay.querySelector(".file-type");
        const fileNameSpan = fileDisplay.querySelector(".file-name");

        fileTypeSpan.textContent = fileType;
        fileNameSpan.textContent = file.name;

        // 파일 데이터 저장 (전송 시 필요)
        const reader = new FileReader();
        reader.onload = function () {
            fileDisplay.dataset.fileData = reader.result;
            console.log("파일 데이터 설정됨:", fileDisplay.dataset.fileData);
        };
        reader.onerror = function (error) {
            console.error("FileReader 에러:", error);
            alert("파일을 읽는 중 오류가 발생했습니다.");
        };
        reader.readAsDataURL(file);

        // fileDisplay 표시
        fileDisplay.classList.remove("hidden");
        fileDisplay.style.display = "flex";
    }

    

    // Sidebar 초기화 함수
    function initSidebar() {
        const menuToggle = document.querySelector(".menu-toggle");
        const sidebar = document.getElementById("sidebar");
        const themeToggle = document.getElementById("themeToggle");
        const fileInput = document.getElementById("fileInput");
        const fileList = document.getElementById("fileList");

        // FAQ, Issue, Notice 버튼 초기화
        const faqButton = document.getElementById("faqButton");
        const issueButton = document.getElementById("issueButton");
        const noticeButton = document.getElementById("noticeButton");
        const complainButton = document.getElementById("complainButton");

        // 메뉴 버튼 클릭 이벤트
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });

        // 로컬 스토리지에서 테마 상태 로드
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-theme");
            themeToggle.checked = true; // 토글 상태 업데이트
        } else {
            document.body.classList.remove("dark-theme");
            themeToggle.checked = false; // 기본값 설정
        }

        // 테마 전환 이벤트
        themeToggle.addEventListener("change", () => {
            const isDark = themeToggle.checked;
            document.body.classList.toggle("dark-theme", isDark);
            localStorage.setItem("theme", isDark ? "dark" : "light"); // 테마 상태 저장
        });

        // 파일 선택 이벤트
        fileInput.addEventListener("change", () => {
            const files = Array.from(fileInput.files);

            files.forEach((file) => {
                addFileToList(file);
            });

            // 파일 입력 초기화
            fileInput.value = "";
        });

        // FAQ 버튼 클릭 이벤트
        faqButton.addEventListener("click", () => {
            console.log("FAQ 버튼 클릭됨");
            window.loadPage("faq.html", "faq.css", "faq-style"); // faq.html 로드
        });

        issueButton.addEventListener("click", () => {
            console.log("서초이슈 버튼 클릭됨");
            window.loadPage("issue.html", "issue.css", "issue-style"); // issue.html 로드
        });

        noticeButton.addEventListener("click", () => {
            console.log("공지사항 버튼 클릭됨");
            window.loadPage("notice.html", "notice.css", "notice-style"); // notice.html 로드
        });

        complainButton.addEventListener("click", () => {
            console.log("공지사항 버튼 클릭됨");
            window.loadPage("complainList.html", "complainList.css", "complain-style"); // complain.html 로드
        });

        // 파일을 목록에 추가하는 함수
        function addFileToList(file) {
            const fileItem = document.createElement("div");
            fileItem.classList.add("file-item");

            const fileName = document.createElement("span");
            fileName.classList.add("file-name");
            fileName.textContent = file.name;

            const fileActions = document.createElement("div");
            fileActions.classList.add("file-actions");

            const saveButton = document.createElement("img");
            saveButton.src = "img/save.png"; // 저장 아이콘 이미지 경로
            saveButton.alt = "저장";
            saveButton.title = "저장";

            const deleteButton = document.createElement("img");
            deleteButton.src = "img/delete.png"; // 삭제 아이콘 이미지 경로
            deleteButton.alt = "삭제";
            deleteButton.title = "삭제";

            // 선택 버튼 (이미지)
            const selectButton = document.createElement("img");
            selectButton.src = "img/upload.png"; // 선택 아이콘 이미지 경로
            selectButton.alt = "선택";
            selectButton.title = "선택";

            // 저장 버튼 클릭 이벤트
            saveButton.addEventListener("click", () => {
                // 저장 기능 구현 (예: 서버로 전송)
                console.log(`${file.name} 저장 버튼 클릭`);
                alert(`${file.name} 파일을 저장했습니다.`);
            });

            // 삭제 버튼 클릭 이벤트
            deleteButton.addEventListener("click", () => {
                // 삭제 기능 구현 (예: 목록에서 제거)
                console.log(`${file.name} 삭제 버튼 클릭`);
                fileList.removeChild(fileItem);
            });

            // 선택 버튼 클릭 이벤트
            selectButton.addEventListener("click", () => {
                console.log(`${file.name} 선택 버튼 클릭`);
                handleFileSelection(file); // 공통 함수 호출
            });

            fileActions.appendChild(saveButton);
            fileActions.appendChild(deleteButton);
            fileActions.appendChild(selectButton);

            fileItem.appendChild(fileName);
            fileItem.appendChild(fileActions);

            fileList.appendChild(fileItem);
        }

       
    }

    // Splash 이벤트 초기화 함수
    function initSplashEvents() {
        console.log("Splash 화면 이벤트 초기화");

        // 요소 가져오기
        const typingElement = document.getElementById("typing-text");
        const clipButton = document.getElementById("clipButton");
        const sendButton = document.getElementById("sendButton");
        const fileDisplay = document.getElementById("fileDisplay");
        const fileTypeSpan = fileDisplay.querySelector(".file-type");
        const fileNameSpan = fileDisplay.querySelector(".file-name");
        const removeFileButton = document.getElementById("removeFileButton");
        const errorDisplay = document.getElementById("fileError");
        const errorText = document.getElementById("fileErrorText");
        const messageInput = document.getElementById("messageInput");

        // 타이핑 애니메이션
        const text = "안녕하세요 서초구청 챗봇 '서봇'입니다.<br> 무엇을 도와드릴까요?";
        let i = 0;

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
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf,.docx"; // 허용 파일 확장자 설정
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);

        // Clip 버튼 클릭 이벤트
        clipButton.addEventListener("click", function () {
            fileInput.click();
        });

        // 파일 선택 이벤트 처리
        fileInput.addEventListener("change", () => {
            errorDisplay.style.display = "none";
            errorDisplay.classList.remove("active");

            if (fileInput.files.length > 0) {
                const selectedFile = fileInput.files[0];
                const allowedExtensions = ["pdf", "docx"];
                const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

                

                // 파일 확장자 체크
                if (allowedExtensions.includes(fileExtension)) {
                    fileNameSpan.textContent = selectedFile.name;
                    fileDisplay.classList.remove("hidden");
                    errorDisplay.classList.add("d-none");
                } else {
                    showErrorMessage("지원하지 않는 파일 형식입니다. PDF 또는 DOCX 파일만 업로드하세요.");
                    fileInput.value = ""; // 입력 초기화
                }

                handleFileSelection(selectedFile); // 공통 함수 호출
            } else {
                // 파일이 선택되지 않았을 때
                showErrorMessage("파일을 선택해주세요.");
            }
        });





        // 파일 제거 버튼 클릭 이벤트
        removeFileButton.addEventListener("click", function () {
            resetInputs();
        });

        // Send 버튼 클릭 이벤트: main.html 로드
        sendButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("SendButton 클릭됨! Main 페이지 로드");

            const message = messageInput.value.trim();
            const fileName = fileNameSpan.textContent ? fileNameSpan.textContent : null;
            const fileType = fileTypeSpan.textContent || null;
            const fileData = fileDisplay.dataset.fileData || null;

            console.log("전송할 데이터:", { message, fileName, fileType, fileData });

            // 메시지나 파일 정보가 없는 경우 경고
            if (!message && !fileName) {
                alert("메시지나 파일을 입력해주세요.");
                return;
            }


            const formData = new FormData();
            formData.append("message", message);
            if (fileInput.files.length > 0) {
                formData.append("file", fileInput.files[0]);
            }
    
            // PHP로 Ajax 요청 전송
            fetch("upload.php", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.text())
                .then((data) => {
                    console.log("서버 응답:", data);
                    alert("업로드 완료: " + data);
    
                    
                })
                .catch((error) => {
                    console.error("업로드 실패:", error);
                    alert("업로드 실패: 서버 오류가 발생했습니다.");
                });



            // 데이터 저장 및 main.html 로드
            try {
                const chatData = { 
                    message,
                    fileName, 
                    fileType, 
                    fileData,
                    timestamp: new Date().toISOString()
                };
                const chatDataString = JSON.stringify(chatData);
                console.log(`chatData 크기: ${chatDataString.length} characters`);

                // `localStorage` 용량 확인
                const currentStorageUsage = JSON.stringify(localStorage).length;
                const totalStorageLimit = 5 * 1024 * 1024; // 5MB
                if ((currentStorageUsage + chatDataString.length) > totalStorageLimit) {
                    alert("저장 용량을 초과했습니다. 파일 크기를 줄이거나 다른 파일을 선택해주세요.");
                    return;
                }

                localStorage.setItem("chatData", chatDataString);
                console.log("데이터 저장 완료:", chatData);
                
                window.loadPage("main.html", "main.css", "page-style");
            } catch (error) {
                console.error("데이터 저장 중 오류 발생:", error);
                alert(`데이터 저장에 문제가 발생했습니다: ${error.message}`);
            }
        });

        function resetInputs() {
            messageInput.value = "";
            fileNameSpan.textContent = "";
            fileTypeSpan.textContent = "";
            fileDisplay.classList.add("hidden");
            fileDisplay.style.display = "none";
            fileInput.value = "";
            delete fileDisplay.dataset.fileData;
            errorDisplay.style.display = "none";
            errorDisplay.classList.remove("active");
            localStorage.removeItem("chatData");
        }

        function showErrorMessage(message) {
            errorText.textContent = message;
            errorDisplay.style.display = "block";
            errorDisplay.classList.add("active");
        }
    }

    // Main 이벤트 초기화 함수
    function initMainEvents() {
        console.log("Main 화면 이벤트 초기화");

        // 요소 가져오기
        const chatArea = document.getElementById("chatArea");
        const sendButton = document.getElementById("sendButton");
        const clipButton = document.getElementById("clipButton");
        const messageInput = document.getElementById("messageInput");
        const fileInput = document.createElement("input");
        const fileDisplay = document.getElementById("fileDisplay");
        const fileNameSpan = fileDisplay.querySelector(".file-name");
        const fileTypeSpan = fileDisplay.querySelector(".file-type");
        const errorDisplay = document.getElementById("fileError");
        const errorText = document.getElementById("fileErrorText");
        const removeFileButton = document.getElementById("removeFileButton");

        // 초기 상태: fileError 숨기기
        errorDisplay.style.display = "none";
        errorDisplay.classList.remove("active");

        // 파일 제거 버튼 클릭 이벤트
        removeFileButton.addEventListener("click", function () {
            resetInputs();
        });

        // 파일 입력 초기화
        fileInput.type = "file";
        fileInput.accept = "*/*";
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);

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
                handleFileSelection(selectedFile); // 공통 함수 호출
            } else {
                // 파일이 선택되지 않았을 때
                showErrorMessage("파일을 선택해주세요.");
            }
        });

        // 로컬 스토리지에서 데이터 로드 및 사용자 메시지 출력
        const chatData = JSON.parse(localStorage.getItem("chatData"));

        if (chatData) {
            const { message, fileName, fileType, fileData } = chatData;

            const userBubble = createUserBubble(message, fileName, fileType, fileData);
            chatArea.appendChild(userBubble);
            chatArea.scrollTop = chatArea.scrollHeight;
            localStorage.removeItem("chatData");
        }

        sendButton.addEventListener("click", async function (event) {
            event.preventDefault();
        
            const message = messageInput.value.trim();
            const uploadedFilename = '1._2025년_상반기_배드민턴_정기배정_안내문.pdf'; // 파일명 하드코딩
        
            if (!message) {
                alert("메시지를 입력해주세요.");
                return;
            }
        
            console.log("전송할 데이터:", { question: message, filename: uploadedFilename });
        
            try {
                const response = await fetch("http://127.0.0.1:5000/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: message,
                        filename: uploadedFilename,
                    }),
                });
        
                const data = await response.json();
        
                if (!response.ok) {
                    console.error("서버 에러:", data);
                    alert(`서버 응답 오류: ${data.answer}`);
                    throw new Error(`서버 응답: ${response.statusText}`);
                }
        
                console.log("서버 응답:", data);
        
                const answer = data.answer;
        
                // 사용자 메시지 버블 추가
                addMessageToChatArea(message, 'user'); // 사용자 메시지 추가
        
                // GPT 답변 메시지 버블 추가
                addMessageToChatArea(answer, 'bot'); // GPT 메시지 추가
        
                // 채팅 영역 스크롤 하단으로 이동
                chatArea.scrollTop = chatArea.scrollHeight;
        
            } catch (error) {
                console.error("에러 발생:", error);
                alert("서버 요청 중 문제가 발생했습니다.");
            }
        
            resetInputs();
        });
        
        // 메시지 추가 함수
        function addMessageToChatArea(message, sender) {
            const chatArea = document.getElementById('chatArea');
            const messageElement = document.createElement('div');
            
            // 사용자 메시지와 GPT 메시지 구분
            if (sender === 'user') {
                messageElement.classList.add('user-message'); // 사용자 메시지 스타일
            } else if (sender === 'bot') {
                messageElement.classList.add('bot-message'); // GPT 메시지 스타일
            }
        
            // 메시지 텍스트 추가
            const messageText = document.createElement('p');
            messageText.textContent = message;
            messageElement.appendChild(messageText);
        
            chatArea.appendChild(messageElement);
        }
        
        // 사용자 메시지 버블 생성 함수
        function createUserBubble(message, fileName, fileType, fileData) {
            const userBubble = document.createElement("div");
            userBubble.className = "user-message"; // 사용자 메시지와 동일한 클래스 사용

            if (fileName) {
                // 파일 디스플레이 영역
                const fileBubble = document.createElement("div");
                fileBubble.className = "file-bubble";

                // 파일 아이콘
                const fileIcon = document.createElement("img");
                fileIcon.src = "img/file.png"; // 파일 아이콘 경로
                fileIcon.alt = "File Icon";

                // 파일 정보 컨테이너 (file-info)
                const fileInfo = document.createElement("div");
                fileInfo.className = "file-info";

                // 파일 형식 텍스트
                const fileTypeElement = document.createElement("span");
                fileTypeElement.textContent = fileType;
                fileTypeElement.className = "file-type";

                // 파일 이름 텍스트
                const fileNameElement = document.createElement("span");
                fileNameElement.textContent = fileName;
                fileNameElement.className = "file-name";

                // 파일 디스플레이 요소 추가
                fileInfo.appendChild(fileTypeElement);
                fileInfo.appendChild(fileNameElement);

                fileBubble.appendChild(fileIcon);
                fileBubble.appendChild(fileInfo);

                userBubble.appendChild(fileBubble);
            }

            // 메시지 텍스트 추가
            const messageText = document.createElement("p");
            messageText.textContent = message || " "; // 공백으로 대체
            userBubble.appendChild(messageText);

            return userBubble;
        }

        // 입력 필드 및 파일 디스플레이 초기화 함수
        function resetInputs() {
            messageInput.value = "";
            fileNameSpan.textContent = "";
            fileTypeSpan.textContent = "";
            fileDisplay.classList.add("hidden");
            fileDisplay.style.display = "none";
            fileInput.value = "";
            delete fileDisplay.dataset.fileData;
            errorDisplay.style.display = "none";
            errorDisplay.classList.remove("active");
            localStorage.removeItem("chatData");
        }

        // 오류 메시지 표시 함수
        function showErrorMessage(message) {
            errorText.textContent = message;
            errorDisplay.style.display = "block";
            errorDisplay.classList.add("active");
        }
    }

    // 헤더에 닉네임을 업데이트하는 함수
    function updateHeaderNickname(nickname) {
        const usernameBox = document.getElementById("usernameBox");
        if (usernameBox) {
            usernameBox.textContent = `${nickname}님`;
            console.log(`헤더 닉네임 업데이트됨: ${nickname}`);
        } else {
            console.error("usernameBox 요소를 찾을 수 없습니다.");
        }
    }

    function initLoginEvents() {
        console.log("Login 이벤트 초기화");
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');
        const signupButton = document.getElementById('signupButton');
    
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
    
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
    
                // login.php가 JSON이 아닌 HTML 형태로 응답하므로, text 형태로 처리
                fetch('http://127.0.0.1:3000/login.php', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log("로그인 성공! user_id 확인 중...");
                        // 로그인 성공 후 user_id 확인을 위해 get_userId.php 호출
                        fetch('http://127.0.0.1:3000/get_userId.php', {
                            method: 'GET',
                            credentials: 'include'
                        })
                        .then(response => response.json())
                        .then(userData => {
                            if (userData.status === 'success') {
                                const userId = userData.user_id;
                                console.log(`로그인한 사용자 ID: ${userId}`);
    
                                if (userId === 4) {
                                    // 관리자 ID인 경우 admin.html 로드
                                    localStorage.setItem('isAdmin', 'true');
                                    window.loadPage('admin.html', 'admin.css', 'admin-style');
                                } else {
                                    // 일반 사용자 ID인 경우 index.html 로드
                                    localStorage.setItem('isAdmin', 'false');
                                    window.loadPage('index.html', 'index.css', 'page-style');
                                    initHeader(); 
                                }
                            } else {
                                // user_id를 가져오는 데 실패한 경우
                                console.error(userData.message);
                                loginError.textContent = '로그인 후 사용자 정보를 가져오는 데 실패했습니다.';
                                loginError.style.display = 'block';
                            }
                        })
                        .catch(error => {
                            console.error('user_id 요청 오류:', error);
                            loginError.textContent = '사용자 정보를 가져오는 중 오류가 발생했습니다.';
                            loginError.style.display = 'block';
                        });
                    } else {
                        // 로그인 실패 시 에러 메시지 표시
                        loginError.textContent = data.message;
                        loginError.style.display = 'block';
                    }
                })
                
                
            });
        }
    
        if (signupButton) {
            console.log("signupButton 존재");
            signupButton.addEventListener("click", function (event) {
                event.preventDefault();
                console.log("회원가입 버튼 클릭됨! 회원가입 페이지 로드");
                window.loadPage("signup.html", "signup.css", "page-style");
            });
        } else {
            console.error("signupButton 요소를 찾을 수 없습니다.");
        }
    }
    

    


    // Signup 이벤트 초기화 함수
    function initSignupEvents() {
        console.log("Signup 화면 이벤트 초기화");
    
        const signupForm = document.getElementById('signupForm');
        const signupError = document.getElementById('signupError');
    
        if (signupForm) {
            signupForm.addEventListener('submit', function (e) {
                e.preventDefault(); // 기본 폼 제출 막기
    
                const nickname = document.getElementById('nickname').value.trim();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
    
                const formData = new FormData();
                formData.append('nickname', nickname);
                formData.append('email', email);
                formData.append('password', password);
    
                fetch('http://127.0.0.1:3000/signup.php', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                })
                .then(response => response.text()) // 응답을 먼저 텍스트로 받음
                .then(text => {
                    console.log("서버 응답:", text);
                    try {
                        const data = JSON.parse(text); // JSON 파싱
                        if (data.status === 'success') {
                            alert(data.message);
                            window.loadPage('login.html', 'login.css', 'page-style');
                        } else {
                            alert(data.message);
                            console.error("서버 오류:", data.message);
                        }
                    } catch (error) {
                        console.error('JSON 파싱 오류:', error, '응답:', text);
                        alert("서버 오류: 올바른 JSON이 반환되지 않았습니다.");
                    }
               
                })
                .catch(err => {
                    console.error('회원가입 오류:', err);
                    signupError.textContent = '서버 오류가 발생했습니다.';
                    signupError.style.display = 'block';
                });
            });
        } else {
            console.error("signupForm 요소를 찾을 수 없습니다.");
        }

        if (cancelSignupButton) {
            cancelSignupButton.addEventListener('click', function (e) {
                e.preventDefault();
                console.log("취소 버튼 클릭됨! 로그인 페이지 로드");
                window.loadPage('login.html', 'login.css', 'page-style'); // 로그인 페이지로 이동
            });
        } else {
            console.error("cancelSignupButton 요소를 찾을 수 없습니다.");
        }


    }
    
    // Help 페이지 이벤트 초기화
    function initHelpEvents() {
        console.log("Help 화면 이벤트 초기화");

        const backButton = document.getElementById("backButton");

        if (backButton) {
            backButton.addEventListener("click", function () {
                console.log("Splash 화면으로 돌아가기");
                loadPage("splash.html", "splash.css", "page-style");
            });
        } else {
            console.error("backButton 요소를 찾을 수 없습니다.");
        }
    }

    function initFaqEvents() {
        console.log("FAQ 화면 이벤트 초기화");
    
        let faqData = []; // JSON 데이터
        let loadedCount = 0; // 현재까지 불러온 항목 수
        const loadSize = 5; // 한 번에 불러올 항목 수
        const faqContainer = document.getElementById("faq-container");
        let currentCategory = "clean"; // 현재 선택된 카테고리 추적
    
        // JSON 파일 경로 매핑
        const fileMap = {
            clean: "./json/faqClean.json",
            tax: "./json/faqTax.json",
            civil: "./json/faqComplain.json",
        };
    
        // JSON 데이터를 불러오는 함수
        async function fetchFAQData(category) {
            console.log(`fetchFAQData 호출됨: ${category}`);
            currentCategory = category; // 현재 카테고리 설정
            try {
                const response = await fetch(fileMap[category]);
                console.log(`JSON 파일 로드 시도: ${fileMap[category]}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                faqData = await response.json();
                console.log(`JSON 데이터 로드 성공:`, faqData);
                loadedCount = 0; // 불러온 항목 초기화
                faqContainer.innerHTML = ""; // 기존 내용 비우기
                loadMoreFAQs();
            } catch (error) {
                console.error("FAQ 데이터를 불러오는 중 오류 발생:", error);
            }
        }
    
        // FAQ 항목 추가 함수
        function loadMoreFAQs() {
            console.log("loadMoreFAQs 호출됨");
            const endIndex = loadedCount + loadSize;
    
            for (let i = loadedCount; i < endIndex && i < faqData.length; i++) {
                const item = faqData[i];
                console.log(`FAQ 항목 추가:`, item);
                const groupDiv = document.createElement("div");
                groupDiv.classList.add("faq-item");
    
                // 카테고리 조건부 표시
                const categoryText =
                    currentCategory === "civil"
                        ? item.first_category || "카테고리 없음"
                        : item.second_category || "카테고리 없음";
    
                groupDiv.innerHTML = `
                    <div class="faq-header">
                        <span class="category">${categoryText}</span>
                        <p class="question">${item.question}</p>
                        <img src="./img/Expand Arrow.png" class="expand-arrow" alt="Expand Arrow" />
                    </div>
                    <div class="faq-content">
                        <p class="answer">${item.answer.replace(/\n/g, "<br>")}</p>
                    </div>
                `;
    
                faqContainer.appendChild(groupDiv);
    
                // 클릭 이벤트 추가
                const expandArrow = groupDiv.querySelector(".expand-arrow");
                const faqContent = groupDiv.querySelector(".faq-content");
    
                expandArrow.addEventListener("click", () => {
                    faqContent.classList.toggle("show");
                    expandArrow.classList.toggle("rotate");
                    console.log("FAQ 항목 확장/축소됨");
                });
            }
    
            loadedCount = Math.min(endIndex, faqData.length); // 항목 수 업데이트
            console.log(`loadedCount 업데이트: ${loadedCount}`);
        }
    
        // 무한 스크롤 이벤트
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
    
            // 스크롤이 페이지 끝에 도달하면 더 많은 항목 불러오기
            if (scrollTop + windowHeight >= documentHeight - 10) {
                console.log("무한 스크롤 트리거됨");
                loadMoreFAQs();
            }
        });
    
        // 카테고리 버튼 클릭 이벤트
        const categoryButtons = document.querySelectorAll(".first-category");
        categoryButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                console.log(`카테고리 버튼 클릭됨: ${btn.dataset.category}`);
                categoryButtons.forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                const category = btn.dataset.category;
                fetchFAQData(category);
            });
        });
    
        // 초기 데이터 로드
        fetchFAQData("clean");
    }

    // Issue 이벤트 초기화 함수
    function initIssueEvents() {
        // Issue 페이지 관련 이벤트 초기화
        console.log("issue 화면 이벤트 초기화");
        initApp(); // 바로 초기화 함수 호출
    
        function initApp() {
            loadNewsData();
            setupModal();
        }
    
        function loadNewsData() {
            fetch('./json/newsData.json')
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('news-container');
                    data.forEach(item => {
                        container.appendChild(createNewsItem(item));
                    });
                })
                .catch(error => console.error('Error loading news data:', error));
        }
    
        function createNewsItem(item) {
            const newsDiv = document.createElement('div');
            newsDiv.className = 'news-item';
    
            const imgDiv = document.createElement('div');
            imgDiv.className = 'news-image';
            imgDiv.style.backgroundImage = `url(https://www.seocho.go.kr${item.img})`;
            imgDiv.addEventListener('click', () => {
                showModal(item.img);
            });
    
            const title = document.createElement('a');
            title.className = 'news-title';
            title.textContent = item.title;
            title.href = item.url ? item.url : "#";
            title.target = '_blank';
    
            newsDiv.appendChild(imgDiv);
            newsDiv.appendChild(title);
    
            return newsDiv;
        }
    
        function setupModal() {
            const modal = document.getElementById("myModal");
            const span = document.getElementsByClassName('close')[0];
    
            span.onclick = function() {
                modal.style.display = 'none';
            }
    
            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            }
        }
    
        function showModal(imgUrl) {
            const modal = document.getElementById("myModal");
            const modalImg = document.getElementById("modal-img");
            modal.style.display = 'block';
            modalImg.src = `https://www.seocho.go.kr${imgUrl}`;
        }
    }

    // 사용자 공지 조회회
    function initNoticeEvents() {
        const noticeRows = document.querySelectorAll(".table tbody tr");
        const noticeContent = document.getElementById("notice-content");
        const noticeTitle = document.getElementById("notice-title");
        const noticeBody = document.getElementById("notice-body");
        const backButton = document.getElementById("back-button");
        const noticeList = document.getElementById("notice-list");


        // 공지사항 데이터 예시
        const noticeData = [
            { title: "공지", body: "챗봇 업데이트 안내 공사로 인한 명일선 해제 및 시스템 점검이 예정되어 있습니다." },
            { title: "챗봇 기능 개선 공지", body: "챗봇 기능이 개선되어 사용자 경험이 더욱 향상되었습니다." },
            { title: "포토후기 이벤트 당첨자 발표", body: "포토후기 이벤트 당첨자 명단이 발표되었습니다." },
            { title: "시스템 점검 안내", body: "시스템 점검이 완료되었습니다. 감사합니다." },
            { title: "배송 불가 지역 안내", body: "롯데택배 배송 불가 지역에 대한 안내입니다." },
        ];

        // 각 행 클릭 시 공지사항 내용 표시
        noticeRows.forEach((row, index) => {
            row.addEventListener("click", () => {
                const data = noticeData[index];
                if(data) {
                    noticeTitle.textContent = data.title;
                    noticeBody.textContent = data.body;

                    noticeContent.classList.remove("hidden");
                    noticeList.classList.add("hidden");
                }
            });
        });

        // 뒤로가기 버튼 클릭 이벤트
        if (backButton) {
            backButton.addEventListener("click", () => {
                // 상세 내용 숨기고 테이블 다시 표시
                noticeContent.classList.add("hidden");
                noticeList.classList.remove("hidden");
            });
        }
    }




    //사용자 문의 전체 조회
    function initComplainListEvents(){

        fetchComplaints();

        //문의 작성 페이지로 이동
        const writeComplainButton = document.getElementById("writeComplain");
        if (writeComplainButton) {
            writeComplainButton.addEventListener("click", () => {
                console.log("작성하기 버튼 클릭됨");
                loadPage("complain.html", "complain.css", "complainWriteCss"); 
            });
        } else {
            console.error('writeComplainButton 요소를 찾을 수 없습니다.');
        }
    }

    function fetchComplaints() {
        fetch('http://127.0.0.1:3000/complain.php', { 
            method: 'GET',
            credentials: 'include' 
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const complaints = data.data;
                console.log(`받은 컴플레인 수: ${complaints.length}`);
                renderComplaints(complaints);
            } else {
                console.error(`컴플레인 가져오기 실패: ${data.message}`);
                displayError(`컴플레인 가져오기 실패: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('컴플레인 요청 오류:', error);
            displayError('컴플레인을 가져오는 중 오류가 발생했습니다.');
        });
    }

    function renderComplaints(complaints) {
        const container = document.getElementById('complaintsContainer');
        container.innerHTML = ''; // 기존 내용 초기화
    
        if (complaints.length === 0) {
            container.innerHTML = '<p>현재 처리할 컴플레인이 없습니다.</p>';
            return;
        }
    
        complaints.forEach(complaint => {
            // 컴플레인 요소 생성
            const complaintElem = document.createElement('div');
            complaintElem.classList.add('complaint');
            complaintElem.style.cursor = 'pointer'; // 클릭 가능한 요소임을 시각적으로 표시
    
            // 컴플레인 제목
            const title = document.createElement('h4');
            title.textContent = complaint.title || '제목 없음';
            complaintElem.appendChild(title);
    
            // 컴플레인 내용
            const content = document.createElement('p');
            content.textContent = complaint.content;
            complaintElem.appendChild(content);
    
            // 메타 정보 (작성자, 작성일)
            const meta = document.createElement('p');
            meta.classList.add('meta');
            meta.textContent = `작성자: ${complaint.nickname} | 작성일: ${complaint.created_at}`;
            complaintElem.appendChild(meta);
    
            // 클릭 이벤트 추가
            complaintElem.addEventListener('click', () => {
                const complainId = complaint.id; // 혹은 해당하는 ID 필드명
                // complain.html에 complainId를 쿼리 파라미터로 전달
                window.loadPage(`complainAdmin.html?complainId=${complainId}`, 'complainAdmin.css', 'complainCss');
            });
    
            // 컴플레인 요소를 컨테이너에 추가
            container.appendChild(complaintElem);
        });

    }
    

    // 사용자 문의작성  페이지 초기화
    function initComplainEvents(){
        const complainForm = document.getElementById("complainForm");
        const feedbackDiv = document.getElementById("feedback");

        if (!complainForm) {
            console.error("complainForm 요소를 찾을 수 없습니다.");
            return;
        }

        // 문의 작성 폼 제출 이벤트 리스너
        complainForm.addEventListener("submit", function(event) {
            event.preventDefault(); // 기본 폼 제출 동작 방지
            submitComplain();
        });

        // 문의 제출 함수
        function submitComplain() {
            const title = document.getElementById("title").value.trim();
            const content = document.getElementById("content").value.trim();

            // 입력 검증
            if (!title || !content) {
                feedbackDiv.innerHTML = '<p style="color: red;">제목과 내용을 모두 입력해주세요.</p>';
                return;
            }

            // 문의 데이터 준비
            const complainData = {
                flag: false, // 질문 작성이므로 flag는 false
                title: title,
                content: content
                // q_id는 질문 작성 시 필요하지 않으므로 제외
            };

            // POST 요청 보내기
            fetch('http://127.0.0.1:3000/complain.php', {
                method: 'POST',
                credentials: 'include', // 세션 쿠키 포함
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(complainData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    feedbackDiv.innerHTML = `<p style="color: green;">${sanitizeHTML(data.message)}</p>`;
                    complainForm.reset(); // 폼 초기화
                } else {
                    feedbackDiv.innerHTML = `<p style="color: red;">${sanitizeHTML(data.message)}</p>`;
                }
            })
            .catch(error => {
                console.error('Error submitting complain:', error);
                feedbackDiv.innerHTML = '<p style="color: red;">문의 제출 중 오류가 발생했습니다.</p>';
            });
        }

        // 간단한 HTML 인젝션 방지 함수
        function sanitizeHTML(str) {
            const temp = document.createElement("div");
            temp.textContent = str;
            return temp.innerHTML;
        }
    }

    
    //관리자 페이지 초기화 함수
    function initAdminEvents(){

        fetchComplaints();
        fetchNotices();


        // 공지사항
        const noticeContainer = document.getElementById("noticeContent");
        let notices = [];
        let currentIndex = 0;
    
        // 공지사항 데이터를 가져오는 함수
        async function fetchNotices() {
            try {
                const response = await fetch("http://127.0.0.1:3000/notice.php", {
                    method: "GET",
                    credentials: "include" // 필요 시 인증 정보 포함
                });
    
                const result = await response.json();
    
                if (result.status === "success") {
                    notices = result.data;
                    if (notices.length > 0) {
                        displayNotice(notices[currentIndex]);
                        // 8초 간격으로 다음 공지사항 표시
                        setInterval(() => {
                            currentIndex = (currentIndex + 1) % notices.length;
                            displayNotice(notices[currentIndex]);
                        }, 5000);
                    } else {
                        noticeContainer.innerHTML = "<p>공지사항이 없습니다.</p>";
                    }
                } else {
                    noticeContainer.innerHTML = `<p>${result.message}</p>`;
                }
            } catch (error) {
                console.error("공지사항 로드 실패:", error);
                noticeContainer.innerHTML = "<p>공지사항을 불러오는 중 오류가 발생했습니다.</p>";
            }
        }
    
        // 공지사항을 표시하는 함수
        function displayNotice(notice) {
            noticeContainer.innerHTML = `
                <div class="notice-item">
                    <h3>${sanitizeHTML(notice.title)}</h3>
                    <p>${sanitizeHTML(notice.content)}</p>
                    <span class="notice-date">${formatDate(notice.timestamp)}</span>
                </div>
            `;
        }
    
    
        // 간단한 HTML 인젝션 방지 함수
        function sanitizeHTML(str) {
            const temp = document.createElement("div");
            temp.textContent = str;
            return temp.innerHTML;
        }

        //공지사항 페이지로 이동
         const noticeHeader = document.getElementById("noticeContainer");
        if (noticeHeader) {
            noticeHeader.addEventListener("click", () => {
                console.log("공지사항 헤더 클릭됨");
                loadPage("noticeAdmin.html", "noticeAdmin.css", "noticeAdminCss"); // 적절한 CSS 파일과 ID 사용
            });
        } else {
            console.error("noticeHeader 요소를 찾을 수 없습니다.");
        }
      
        

    }

     // 날짜 형식 변경 함수
     function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    }

    // 관리자 공지사항 (전체 list)
    function initAdminNoticeEvents() {
        console.log("공지사항 화면 이벤트 초기화");
    
        //공지사항 데이터
        fetch('http://127.0.0.1:3000/notice.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success" && data.data.length > 0) {
                    renderNoticeList(data.data);
                } else {
                    renderEmptyNotice();
                }
            })
            .catch(error => {
                console.error("공지사항 데이터 불러오기 실패:", error);
                alert("공지사항 데이터를 불러오지 못했습니다. 다시 시도해 주세요.");
            });
    
        // 공지사항 목록 렌더링
        function renderNoticeList(notices) {
            const noticeContainer = document.getElementById("noticeContainer");
            noticeContainer.innerHTML = ""; 
        
            notices.forEach(notice => {
                const noticeItem = document.createElement("div");
                noticeItem.className = "notice-item";
                noticeItem.innerHTML = `
                    <div class="notice-number">${sanitizeHTML(notice.id)}</div>
                    <div class="notice-content">
                        <div class="notice-header" style="cursor: pointer; color: blue; text-decoration: underline;">
                            ${sanitizeHTML(notice.title)}
                        </div>
                        <div class="notice-date">${formatDate(notice.timestamp)}</div>
                    </div>
                    <button class="notice-delete" style="color: red; background: none; border: none; cursor: pointer;">
                        &times;
                    </button>
                `;
        
                // 삭제 버튼 이벤트 리스너
                const deleteButton = noticeItem.querySelector(".notice-delete");
                deleteButton.addEventListener("click", (event) => {
                    event.stopPropagation(); // 클릭 이벤트 전파 방지
                    deleteNotice(notice.id);
                });
        
                // 공지사항 상세 페이지로 이동 이벤트 리스너
                const noticeHeader = noticeItem.querySelector(".notice-header");
                noticeHeader.addEventListener("click", () => {
                    console.log(`공지사항 ID ${notice.id} 클릭됨`);
                    loadPage(`noticeDetail.html?noticeId=${notice.id}`, 'noticeDetail.css', 'noticeDetailCss');
                });

                function sanitizeHTML(str) {
                    const temp = document.createElement("div");
                    temp.textContent = String(str); // 숫자를 문자열로 변환
                    return temp.innerHTML;
                }
                
        
                noticeContainer.appendChild(noticeItem);
            });
        }
    
        // 공지사항이 없을 때 메시지 표시
        function renderEmptyNotice() {
            const noticeContainer = document.getElementById("noticeContainer");
            noticeContainer.innerHTML = `
                <p style="text-align:center; color:#777;">현재 공지사항이 없습니다.</p>
            `;
        }


        //공지사항 작성 페이지로 이동
        const writeNoticeButton = document.getElementById("writeNoticeButton");
        if (writeNoticeButton) {
            writeNoticeButton.addEventListener("click", () => {
                console.log("작성하기 버튼 클릭됨");
                loadPage("noticeWrite.html", "noticeWrite.css", "noticeWriteCss"); 
            });
        } else {
            console.error('"writeNoticeButton" 요소를 찾을 수 없습니다.');
        }
    }

    
    // 공지사항 삭제 함수
    function deleteNotice(id) {
        if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

        fetch('http://127.0.0.1:3000/notice.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
        if (data.status === "success") {
            alert(data.message);
            initAdminNoticeEvents(); // 삭제 후 목록 새로 불러오기
        } else {
            alert("삭제 실패: " + data.message);
        }
        })
        .catch(error => {
            console.error("공지사항 삭제 중 오류 발생:", error);
            alert("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
        });
    }

    //관리자 공지 작성 
    function initAdminNoticeWriteEvents(){
        const noticeWriteForm = document.getElementById("noticeWriteForm");
        const writeFeedback = document.getElementById("writeFeedback");
    
        if (noticeWriteForm) {
            noticeWriteForm.addEventListener("submit", function(event) {
                event.preventDefault(); // 기본 폼 제출 방지
                submitNotice();
            });
        } else {
            console.error("noticeWriteForm 요소를 찾을 수 없습니다.");
        }
    
        function submitNotice() {
            const title = document.getElementById("noticeTitle").value.trim();
            const content = document.getElementById("noticeContent").value.trim();
    
            if (!title || !content) {
                writeFeedback.innerHTML = '<p style="color: red;">제목과 내용을 모두 입력해주세요.</p>';
                return;
            }
    
            const noticeData = {
                title: title,
                content: content
            };
    
            fetch('http://127.0.0.1:3000/notice.php', { // PHP 백엔드 스크립트 경로
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noticeData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    writeFeedback.innerHTML = `<p style="color: #DAB6F4;">${sanitizeHTML(data.message)}</p>`;
                    noticeWriteForm.reset();
                    setTimeout(() => {
                        writeFeedback.innerHTML = '';
                    }, 5000); // 5초 후 메시지 사라짐
                } else {
                    writeFeedback.innerHTML = `<p style="color: #DAB6F4;">${sanitizeHTML(data.message)}</p>`;
                }
            })
            .catch(error => {
                console.error('Error submitting notice:', error);
                writeFeedback.innerHTML = '<p style="color: #DAB6F4;">공지사항 제출 중 오류가 발생했습니다.</p>';
            });
        }
    
        function sanitizeHTML(str) {
            const temp = document.createElement("div");
            temp.textContent = str;
            return temp.innerHTML;
        }
    };
    
    //공지 상세 
    function initNoticeDetailEvents(noticeId){
        fetch(`http://127.0.0.1:3000/notice.php?noticeId=${noticeId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success" && data.data) {
                    const notice = data.data;
                    document.getElementById('noticeDetailContent').innerHTML = `
                        <h3>${sanitizeHTML(notice.title)}</h3>
                        <p>${sanitizeHTML(notice.content)}</p>
                        <p><em>${formatDate(notice.timestamp)}</em></p>
                    `;
                } else {
                    document.getElementById('noticeDetailContent').innerHTML = '<p>해당 공지사항을 찾을 수 없습니다.</p>';
                }
            })
            .catch(error => {
                console.error("공지사항 상세 데이터 불러오기 실패:", error);
                document.getElementById('noticeDetailContent').innerHTML = '<p>공지사항 데이터를 불러오지 못했습니다.</p>';
            });
    }

    // 간단한 HTML 인젝션 방지 함수
    function sanitizeHTML(str) {
        const temp = document.createElement("div");
        temp.textContent = str;
        return temp.innerHTML;
    }
    


   // 관리자 - 문의
   function initAdminComplainEvents(complainId) {
    console.log(`initAdminComplainEvents 호출됨. complainId: ${complainId}`);
    loadComplainDetail(complainId);

    // 컴플레인 상세 내용을 가져와서 표시
    function loadComplainDetail(complainId) {
        if (!complainId) {
            document.getElementById('complainDetail').innerHTML = '<p>유효한 컴플레인 ID가 제공되지 않았습니다.</p>';
            return;
        }

        // 서버에 GET 요청을 보내서 컴플레인 상세 내용 가져오기
        fetch(`http://127.0.0.1:3000/complain.php?complainId=${complainId}`, { 
            method: 'GET',
            credentials: 'include' // 세션 쿠키 포함
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    console.log('컴플레인 데이터 성공적으로 가져옴');
                    const complaint = data.data[0]; // 단일 컴플레인이라 가정
                    const hasAnswers = complaint.answers && complaint.answers.length > 0;

                    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // isAdmin 상태 확인

                    const detailHtml = `
                        <h2>${sanitizeHTML(complaint.title) || '제목 없음'}</h2>
                        <p>${sanitizeHTML(complaint.content)}</p>
                        <p class="meta">작성자: ${sanitizeHTML(complaint.nickname)} | 작성일: ${sanitizeHTML(complaint.created_at)}</p>
                        <h3>답변</h3>
                        ${hasAnswers ? complaint.answers.map(answer => `
                            <div class="answer">
                                <p>${sanitizeHTML(answer.content)}</p>
                                <p class="meta">작성자: ${sanitizeHTML(answer.nickname)} | 작성일: ${sanitizeHTML(answer.created_at)}</p>
                            </div>
                        `).join('') : '<p>답변이 없습니다.</p>'}
                        ${!hasAnswers && isAdmin ? `
                            <h3>답변 작성</h3>
                            <form id="answerForm">
                                <textarea id="answerContent" rows="4" cols="50" placeholder="답변 내용을 입력하세요." required></textarea><br>
                                <button type="submit">답변 작성</button>
                            </form>
                            <div id="answerFeedback"></div>
                        ` : ''}
                    `;
                    document.getElementById('complainDetail').innerHTML = detailHtml;

                    if (!hasAnswers && isAdmin) {
                        // 답변 작성 
                        document.getElementById('answerForm').addEventListener('submit', function(event) {
                            event.preventDefault();
                            submitAnswer(complainId);
                        });
                    }
                } else {
                    document.getElementById('complainDetail').innerHTML = `<p>${sanitizeHTML(data.message)}</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching complaint details:', error);
                document.getElementById('complainDetail').innerHTML = '<p>컴플레인 상세 내용을 가져오는 중 오류가 발생했습니다.</p>';
            });
    }

    // 답변 제출 함수
    function submitAnswer(complainId) {
        const answerContent = document.getElementById('answerContent').value.trim();
        const feedbackDiv = document.getElementById('answerFeedback');

        if (!answerContent) {
            feedbackDiv.innerHTML = '<p style="color: red;">답변 내용을 입력해주세요.</p>';
            return;
        }

        // 답변 데이터 준비
        const answerData = {
            flag: true,
            content: answerContent,
            q_id: complainId
        };

        // POST 요청 보내기
        fetch('http://127.0.0.1:3000/complain.php', {
            method: 'POST',
            credentials: 'include', // 세션 쿠키 포함
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answerData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                feedbackDiv.innerHTML = '<p style="color: green;">답변이 성공적으로 등록되었습니다.</p>';
                // 답변을 다시 로드하여 표시
                loadComplainDetail(complainId);
            } else {
                feedbackDiv.innerHTML = `<p style="color: red;">${sanitizeHTML(data.message)}</p>`;
            }
        })
        .catch(error => {
            console.error('Error submitting answer:', error);
            feedbackDiv.innerHTML = '<p style="color: red;">답변을 제출하는 중 오류가 발생했습니다.</p>';
        });
    }

    // 간단한 HTML 인젝션 방지 함수 (재사용)
    function sanitizeHTML(str) {
        const temp = document.createElement("div");
        temp.textContent = str;
        return temp.innerHTML;
    }
}


});
