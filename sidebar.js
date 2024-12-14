function initSidebar() {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const themeToggle = document.getElementById("themeToggle");
  
    // 메뉴 버튼 클릭 이벤트
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  
    // 테마 전환 이벤트
    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-theme", themeToggle.checked);
    });
  }
  