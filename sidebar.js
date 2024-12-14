
// 사이드바와 버튼 가져오기
const sidebarContainer = document.getElementById("sidebar-container");
const menuToggleButton = document.querySelector(".menu-toggle");

// 버튼 클릭 시 사이드바 토글
menuToggleButton.addEventListener("click", () => {
  sidebarContainer.classList.toggle("open"); // open 클래스 추가/제거
});
