document.addEventListener("DOMContentLoaded", function () {
    // 헤더 로드
    fetch("header.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("header-container").innerHTML = html;
  
        // 헤더 초기화 함수 호출
        initHeader();
      });
  
    // 사이드바 로드
    fetch("sidebar.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
  
        // 사이드바 초기화 함수 호출
        initSidebar();
      });
  });
  
 // 헤더 초기화 함수
function initHeader() {
  const usernameBox = document.getElementById("usernameBox");
  const logoutButton = document.getElementById("logoutButton");
  const newChatButton = document.getElementById("newChatButton"); 
  const helpButton = document.getElementById("helpButton");

  // 사용자 이름 설정
  const username = localStorage.getItem("username") || "Guest";
  usernameBox.textContent = `${username} 님`;

  // 로그아웃 버튼 이벤트
  logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // 폼 제출 방지
      if (confirm("정말 로그아웃하시겠습니까?")) {
          localStorage.removeItem("username");
          loadPage("login.html", "login.css", "page-style");
      }
  });

  // Help 버튼 이벤트
  helpButton.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Help 화면 로드");
    loadPage("help.html", "help.css", "page-style");
  });
  
  newChatButton.addEventListener("click", function () {
    // Splash 화면 다시 로드
    console.log("새로운 Splash 화면 로드");
    loadPage("splash.html", "splash.css", "page-style");
  });

}






  
function loadPage(url, cssFile, cssId) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
      if (xhr.status === 200) {
          console.log(`${url} 로드 성공`);
          const mainContent = document.getElementById("main-content");
          if (mainContent) {
              mainContent.innerHTML = xhr.responseText;

              // 기존 CSS 제거
              if (cssId) {
                  const existingCSS = document.getElementById(cssId);
                  if (existingCSS) existingCSS.parentNode.removeChild(existingCSS);
              }

              // 새로운 CSS 로드
              if (cssFile) {
                  const link = document.createElement("link");
                  link.rel = "stylesheet";
                  link.href = cssFile;
                  link.id = cssId;
                  document.head.appendChild(link);
              }
              // 콜백 함수 호출
              if (callback && typeof callback === "function") {
                callback();
              }
          } else {
              console.error("main-content 요소를 찾을 수 없습니다.");
          }
      } else {
          console.error(`Failed to load ${url}: ${xhr.statusText}`);
      }
  };

  xhr.onerror = function () {
      console.error(`Error occurred while loading ${url}`);
  };

  xhr.send();
}
