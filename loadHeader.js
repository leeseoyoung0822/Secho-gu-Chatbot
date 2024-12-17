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
  console.log("Header 초기화");

  const usernameBox = document.getElementById("usernameBox");
  const logoutButton = document.getElementById("logoutButton");
  const newChatButton = document.getElementById("newChatButton");
  const helpButton = document.getElementById("helpButton");

  // 서버에서 세션 정보를 가져와 닉네임 설정
  fetch('http://127.0.0.1:3000/get_nickname.php', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              usernameBox.textContent = `${data.nickname}님`;
              logoutButton.textContent = "로그아웃"; // 로그인된 상태일 경우 로그아웃 버튼 표시
              console.log(`헤더 닉네임 설정됨: ${data.nickname}`);

              // 로그아웃 버튼 이벤트
              logoutButton.addEventListener("click", (event) => {
                  event.preventDefault();
                  if (confirm("정말 로그아웃하시겠습니까?")) {
                      localStorage.removeItem("username");
                      loadPage("login.html", "login.css", "page-style");
                  }
              });
          } else {
              console.warn("로그인되지 않은 상태입니다.");
              usernameBox.textContent = "Guest 님";
              logoutButton.textContent = "로그인/회원가입"; // 로그인되지 않은 상태일 경우

              // 로그인 버튼 이벤트
              logoutButton.addEventListener("click", (event) => {
                  event.preventDefault();
                  console.log("로그인 페이지 로드");
                  loadPage("login.html", "login.css", "page-style");
              });
          }
      })
      .catch(error => {
          console.error("세션 정보를 가져오는 중 오류 발생:", error);
          usernameBox.textContent = "Guest 님";
          logoutButton.textContent = "로그인/회원가입"; // 오류 발생 시 기본 상태

          // 로그인 버튼 이벤트
          logoutButton.addEventListener("click", (event) => {
              event.preventDefault();
              console.log("로그인 페이지 로드");
              loadPage("login.html", "login.css", "page-style");
          });
      });

  // Help 버튼 이벤트
  helpButton.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Help 화면 로드");
      loadPage("help.html", "help.css", "page-style");
  });

  newChatButton.addEventListener("click", function () {
      console.log("새로운 Splash 화면 로드");
      loadPage("splash.html", "splash.css", "page-style");
  });

  // 챗봇 타이틀 클릭 이벤트
  const chatbotTitle = document.getElementById("chatbotTitle");
  chatbotTitle.addEventListener("click", function () {
      console.log("챗봇 타이틀 클릭됨! Splash 페이지 로드");
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
