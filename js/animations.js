// 스크롤 애니메이션 기능 추가
document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 애니메이션 적용 요소
    const animatedElements = document.querySelectorAll('.feature-card, .content-card');
    
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('scroll-animation');
                element.classList.add('visible');
            }
        });
    });
    
    // 초기 로드 시 화면에 보이는 요소에 애니메이션 적용
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('scroll-animation');
            element.classList.add('visible');
        } else {
            element.classList.add('scroll-animation');
        }
    });
    
    // 요소가 뷰포트에 있는지 확인하는 함수
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // 이미지 오류 처리
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'images_web/placeholder.png';
            this.onerror = null;
        };
    });
    
    // 접근성 개선 - 키보드 네비게이션
    const navLinks = document.querySelectorAll('.nav-list a, .sub-menu a');
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// 다크 모드 토글 기능 추가
function addDarkModeToggle() {
    // 다크 모드 토글 버튼 생성
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.title = '다크 모드 전환';
    
    // 헤더에 버튼 추가
    const header = document.querySelector('header');
    header.appendChild(darkModeToggle);
    
    // 다크 모드 상태 확인
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDarkMode = localStorage.getItem('darkMode') === 'true' || prefersDarkMode;
    
    // 초기 상태 설정
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // 클릭 이벤트 리스너
    darkModeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('darkMode', isDarkMode);
    });
}

// 페이지 로드 시 다크 모드 토글 추가
document.addEventListener('DOMContentLoaded', function() {
    addDarkModeToggle();
});
