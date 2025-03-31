// 백투탑 버튼 추가
function addBackToTopButton() {
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 클릭 이벤트 리스너
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 검색 기능 추가
function addSearchFunctionality() {
    // 검색 컨테이너 생성
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    // 검색 아이콘
    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.innerHTML = '<i class="fas fa-search"></i>';
    
    // 검색 입력 필드
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = '검색어를 입력하세요...';
    
    // 컨테이너에 요소 추가
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    // 사이드바에 검색 컨테이너 추가
    const sidebar = document.querySelector('.sidebar');
    sidebar.insertBefore(searchContainer, sidebar.firstChild);
    
    // 검색 기능 구현
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // 메인 메뉴 항목 검색
        document.querySelectorAll('.nav-list a').forEach(link => {
            const text = link.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                link.style.backgroundColor = 'rgba(248, 165, 194, 0.2)';
            } else {
                link.style.backgroundColor = '';
            }
        });
        
        // 서브 메뉴 항목 검색
        document.querySelectorAll('.sub-menu a').forEach(link => {
            const text = link.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                link.style.backgroundColor = 'rgba(248, 165, 194, 0.2)';
            } else {
                link.style.backgroundColor = '';
            }
        });
    });
}

// 이미지 미리보기 기능 개선
function enhanceImagePreview() {
    document.querySelectorAll('.content-card img').forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.getElementById('image-modal');
            const modalImg = document.getElementById('modal-image');
            
            // 모달 이미지 소스 설정
            modalImg.src = this.src;
            
            // 모달 표시
            modal.classList.add('active');
            
            // 페이지 전환 애니메이션 적용
            modalImg.classList.add('page-transition');
            
            // 애니메이션 종료 후 클래스 제거
            setTimeout(() => {
                modalImg.classList.remove('page-transition');
            }, 500);
        });
    });
}

// 페이지 로드 시 추가 기능 초기화
document.addEventListener('DOMContentLoaded', function() {
    addBackToTopButton();
    addSearchFunctionality();
    enhanceImagePreview();
    
    // 이미지 로드 오류 처리
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'images_web/placeholder.png';
            this.alt = '이미지를 불러올 수 없습니다';
            this.classList.add('img-placeholder');
        });
    });
    
    // 접근성 개선 - 스킵 링크 추가
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = '본문으로 건너뛰기';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // 메인 콘텐츠에 ID 추가
    const mainContent = document.querySelector('main');
    mainContent.id = 'main-content';
    
    // 툴팁 추가
    document.querySelectorAll('.feature-card, .social-link').forEach(element => {
        element.classList.add('tooltip');
        
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltip-text';
        tooltipText.textContent = element.querySelector('h4')?.textContent || element.textContent;
        
        element.appendChild(tooltipText);
    });
});
