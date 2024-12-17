function initSidebar() {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const themeToggle = document.getElementById("themeToggle");
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    const mainContent = document.getElementById("main-content"); 

    // FAQ, Issue, Notice 버튼 초기화
    const faqButton = document.getElementById("faqButton");
    const issueButton = document.getElementById("issueButton");
    const noticeButton = document.getElementById("noticeButton");

    // 메뉴 버튼 클릭 이벤트
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      mainContent.classList.toggle("shifted"); // 메인 콘텐츠 이동
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
        window.loadPage("issue.html", "issue.css", "issue-style"); // faq.html 로드
    });

    noticeButton.addEventListener("click", () => {
        console.log("공지사항 버튼 클릭됨");
        window.loadPage("notice.html", "notice.css", "issue-style"); // faq.html 로드
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
            console.log(`"${file.name}" 저장 버튼 클릭`);
            alert(`"${file.name}" 파일을 저장했습니다.`);
        });

        // 삭제 버튼 클릭 이벤트
        deleteButton.addEventListener("click", () => {
            // 삭제 기능 구현 (예: 목록에서 제거)
            console.log(`"${file.name}" 삭제 버튼 클릭`);
            fileList.removeChild(fileItem);
        });

         // 선택 버튼 클릭 이벤트
        selectButton.addEventListener("click", () => {
            console.log(`"${file.name}" 선택 버튼 클릭`);
            moveToFileDisplay(file);
        });

        fileActions.appendChild(saveButton);
        fileActions.appendChild(deleteButton);
        fileActions.appendChild(selectButton);

        fileItem.appendChild(fileName);
        fileItem.appendChild(fileActions);

        fileList.appendChild(fileItem);
    }

    // // 파일을 filedisplay로 이동하는 함수
    // function moveToFileDisplay(file) {
    //     // `fileDisplay` 요소 가져오기
    //     const fileDisplay = document.getElementById("fileDisplay");
    
    //     // 파일 정보를 초기화
    //     fileDisplay.innerHTML = "";
    
    //     // 파일 형식 및 이름 설정
    //     const fileType = file.name.split(".").pop().toUpperCase();
    //     const fileName = file.name;
    
    //     // 파일 아이콘 (고정된 이미지)
    //     const fileIcon = document.createElement("img");
    //     fileIcon.src = "img/file.png"; // 파일 아이콘 경로
    //     fileIcon.alt = "File Icon";
    //     fileIcon.classList.add("w-5", "h-5");
    
    //     // 파일 정보 영역
    //     const fileInfo = document.createElement("div");
    //     fileInfo.classList.add("file-info");
    //     fileInfo.innerHTML = `
    //         <span class="file-type">${fileType}</span>
    //         <span class="file-name">${fileName}</span>
    //     `;
    
    //     // 삭제 버튼
    //     const removeButton = document.createElement("button");
    //     removeButton.textContent = "×";
    //     removeButton.classList.add("text-red-500", "hover:text-red-700");
    //     removeButton.addEventListener("click", () => {
    //         fileDisplay.classList.add("hidden");
    //         fileDisplay.innerHTML = ""; // 내용 제거
    //     });
    
    //     // `fileDisplay`에 요소 추가
    //     fileDisplay.appendChild(fileIcon);
    //     fileDisplay.appendChild(fileInfo);
    //     fileDisplay.appendChild(removeButton);
    
    //     // 숨겨진 `fileDisplay` 표시
    //     fileDisplay.classList.remove("hidden");
    //     fileDisplay.style.display = "flex";
    // }
    

  }
  