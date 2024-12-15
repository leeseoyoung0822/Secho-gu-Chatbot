function initSidebar() {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const themeToggle = document.getElementById("themeToggle");
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");


    // 메뉴 버튼 클릭 이벤트
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  
    // 테마 전환 이벤트
    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-theme", themeToggle.checked);
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

    // 파일을 filedisplay로 이동하는 함수
    function moveToFileDisplay(file) {
        // 현재 활성화된 화면의 fileDisplay 요소를 찾습니다.
        const mainContent = document.getElementById("main-content");
        if (!mainContent) {
          console.error("main-content 요소를 찾을 수 없습니다.");
          return;
        }
    
        const fileDisplay = mainContent.querySelector("#fileDisplay");
        if (!fileDisplay) {
          console.error("현재 활성화된 화면의 fileDisplay 요소를 찾을 수 없습니다.");
          return;
        }
    
        // 중복 추가 방지: 동일한 파일명이 이미 있는지 확인
        const existingFiles = Array.from(fileDisplay.querySelectorAll(".file-display-item .file-name"));
        if (existingFiles.some(span => span.textContent === file.name)) {
          alert(`"${file.name}" 파일이 이미 선택되었습니다.`);
          return;
        }
    
        const displayItem = document.createElement("li");
        displayItem.classList.add("file-display-item");
    
        // 파일 아이콘
        const fileIcon = document.createElement("img");
        fileIcon.src = "file.png"; // 파일 아이콘 이미지 경로
        fileIcon.alt = "File Icon";
        fileIcon.classList.add("file-icon");
    
        const fileInfo = document.createElement("div");
        fileInfo.classList.add("file-info");
    
        const fileTypeSpan = document.createElement("span");
        fileTypeSpan.classList.add("file-type");
        fileTypeSpan.textContent = file.name.split(".").pop().toUpperCase();
    
        const fileNameSpan = document.createElement("span");
        fileNameSpan.classList.add("file-name");
        fileNameSpan.textContent = file.name;
    
        fileInfo.appendChild(fileTypeSpan);
        fileInfo.appendChild(fileNameSpan);
    
        // 제거 버튼 (이미지)
        const removeButton = document.createElement("img");
        removeButton.src = "img/delete.png"; // 제거 아이콘 이미지 경로
        removeButton.alt = "제거";
        removeButton.title = "제거";
    
        // 제거 버튼 클릭 이벤트
        removeButton.addEventListener("click", () => {
          fileDisplay.removeChild(displayItem);
        });
    
        displayItem.appendChild(fileIcon);
        displayItem.appendChild(fileInfo);
        displayItem.appendChild(removeButton);
    
        fileDisplay.appendChild(displayItem);

        // `fileDisplay`가 숨겨져 있으면 표시
        if (fileDisplay.classList.contains("hidden")) {
            fileDisplay.classList.remove("hidden");
            fileDisplay.style.display = "flex";
        }
      }
 


  }
  