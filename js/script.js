// 목차 데이터
const tocData = {
    "00": {
        "title": "이용 준비",
        "items": [
            { "number": "0.1", "title": "서비스 소개" },
            { "number": "0.2", "title": "이용안내" },
            { "number": "0.3", "title": "캐시삭제" }
        ]
    },
    "01": {
        "title": "시작하기",
        "items": [
            { "number": "1.1", "title": "회원가입" },
            { "number": "1.2", "title": "로그인" },
            { "number": "1.3", "title": "내 정보 및 학급 확인" },
            { "number": "1.4", "title": "과목 개설" }
        ]
    },
    "02": {
        "title": "메인 화면",
        "items": [
            { "number": "2.1", "title": "메인 화면 구성" },
            { "number": "2.2", "title": "나의 할 일 & 알림" }
        ]
    },
    "03": {
        "title": "나의 학교",
        "items": [
            { "number": "3.1", "title": "나의 교실" },
            { "number": "3.2", "title": "나의 수업" },
            { "number": "3.3", "title": "과목 개설 및 관리" },
            { "number": "3.4", "title": "수업 시간표" },
            { "number": "3.5", "title": "(담임)우리반 게시판" }
        ]
    },
    "04": {
        "title": "수업 진행",
        "items": [
            { "number": "4.1", "title": "등교 수업" },
            { "number": "4.2", "title": "화상 수업" },
            { "number": "4.3", "title": "영상 수업" }
        ]
    },
    "05": {
        "title": "AI 학습진단",
        "items": [
            { "number": "5.1", "title": "AI 학습 진단" },
            { "number": "5.2", "title": "진단하기" },
            { "number": "5.3", "title": "진단결과" },
            { "number": "5.4", "title": "AI 논술 진단" }
        ]
    },
    "06": {
        "title": "학습 콘텐츠",
        "items": [
            { "number": "6.1", "title": "AI 추천 콘텐츠" },
            { "number": "6.2", "title": "영상" },
            { "number": "6.3", "title": "교재" },
            { "number": "6.4", "title": "문제집" },
            { "number": "6.5", "title": "내 콘텐츠" }
        ]
    },
    "07": {
        "title": "AI 리포트",
        "items": [
            { "number": "7.1", "title": "과목 리포트" },
            { "number": "7.2", "title": "학생 리포트" },
            { "number": "7.3", "title": "종합 리포트" }
        ]
    },
    "08": {
        "title": "마이페이지",
        "items": [
            { "number": "8.1", "title": "정보수정" },
            { "number": "8.2", "title": "서비스" }
        ]
    },
    "09": {
        "title": "에듀테크 툴",
        "items": [
            { "number": "9.1", "title": "학급 경영 도구" },
            { "number": "9.2", "title": "클래스보드" }
        ]
    },
    "10": {
        "title": "관리자 페이지 (담임)",
        "items": [
            { "number": "10.1", "title": "계정 관리 (학생)" },
            { "number": "10.2", "title": "학급 관리" },
            { "number": "10.3", "title": "나의 수업 관리" }
        ]
    }
};

// 섹션 콘텐츠 데이터
const sectionContent = {
    "00": {
        "description": "하이러닝 서비스 이용을 위한 기본 준비 사항을 안내합니다.",
        "content": [
            {
                "title": "서비스 소개",
                "description": "경기도교육청 하이러닝은 교육용 AI 및 학습관리 시스템 기반의 온라인 교수·학습 플랫폼입니다.",
                "image": "images_web/4.png"
            },
            {
                "title": "이용안내",
                "description": "하이러닝 서비스 이용을 위한 네트워크 환경 확인 및 브라우저 설정 방법을 안내합니다.",
                "image": "images_web/5.png"
            },
            {
                "title": "캐시삭제",
                "description": "브라우저 캐시 삭제 방법을 안내합니다. 서비스 이용 중 오류가 발생할 경우 캐시 삭제 후 다시 시도해보세요.",
                "image": "images_web/7.png"
            }
        ]
    },
    "01": {
        "description": "하이러닝 서비스 시작을 위한 회원가입 및 로그인 방법을 안내합니다.",
        "content": [
            {
                "title": "회원가입",
                "description": "하이러닝 서비스 이용을 위한 회원가입 방법을 안내합니다.",
                "image": "images_web/8.png"
            },
            {
                "title": "로그인",
                "description": "하이러닝 서비스 로그인 방법을 안내합니다.",
                "image": "images_web/9.jpg"
            },
            {
                "title": "내 정보 및 학급 확인",
                "description": "로그인 후 내 정보 및 학급 확인 방법을 안내합니다.",
                "image": "images_web/10.jpg"
            },
            {
                "title": "과목 개설",
                "description": "교사용 계정으로 과목을 개설하는 방법을 안내합니다.",
                "image": "images_web/11.jpg"
            }
        ]
    },
    // 나머지 섹션 데이터는 실제 구현 시 추가
};

// DOM 요소
const mainNav = document.querySelector('.main-nav');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navList = document.querySelector('.nav-list');
const sidebar = document.querySelector('.sidebar');
const sectionTitle = document.querySelector('.section-title');
const subMenu = document.querySelector('.sub-menu');
const welcomeScreen = document.getElementById('welcome-screen');
const sectionContent = document.getElementById('section-content');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');

// 현재 활성화된 섹션과 항목
let activeSection = '00';
let activeItem = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 모바일 메뉴 토글
    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    // 메인 네비게이션 클릭 이벤트
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section');
            changeSection(section);
        });
    });

    // 모달 닫기 버튼
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 초기 섹션 로드
    changeSection('00');
});

// 섹션 변경 함수
function changeSection(section) {
    // 활성 섹션 업데이트
    activeSection = section;
    activeItem = null;

    // 네비게이션 메뉴 활성화 상태 업데이트
    document.querySelectorAll('.nav-list a').forEach(link => {
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 사이드바 제목 업데이트
    sectionTitle.textContent = tocData[section].title;

    // 사이드바 하위 메뉴 업데이트
    updateSubMenu(section);

    // 섹션 콘텐츠 업데이트
    updateSectionContent(section);

    // 모바일 메뉴 닫기
    navList.classList.remove('active');
}

// 사이드바 하위 메뉴 업데이트 함수
function updateSubMenu(section) {
    subMenu.innerHTML = '';

    tocData[section].items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = `${item.number} ${item.title}`;
        a.setAttribute('data-number', item.number);
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            changeItem(item.number);
        });

        li.appendChild(a);
        subMenu.appendChild(li);
    });
}

// 항목 변경 함수
function changeItem(itemNumber) {
    // 활성 항목 업데이트
    activeItem = itemNumber;

    // 사이드바 하위 메뉴 활성화 상태 업데이트
    document.querySelectorAll('.sub-menu a').forEach(link => {
        if (link.getAttribute('data-number') === itemNumber) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 항목 콘텐츠 업데이트
    updateItemContent(itemNumber);
}

// 섹션 콘텐츠 업데이트 함수
function updateSectionContent(section) {
    // 웰컴 스크린 숨기기
    welcomeScreen.classList.remove('active');

    // 섹션 콘텐츠 초기화
    sectionContent.innerHTML = '';
    sectionContent.classList.add('active');

    // 섹션 데이터가 있는 경우
    if (sectionContent[section]) {
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = `${section}. ${tocData[section].title}`;
        
        const sectionDescription = document.createElement('p');
        sectionDescription.textContent = sectionContent[section].description;
        
        sectionHeader.appendChild(sectionTitle);
        sectionHeader.appendChild(sectionDescription);
        
        const contentCards = document.createElement('div');
        contentCards.className = 'content-cards';
        
        sectionContent[section].content.forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card';
            
            const cardTitle = document.createElement('h3');
            cardTitle.textContent = item.title;
            
            const cardImage = document.createElement('img');
            cardImage.src = `images/${item.image}`;
            cardImage.alt = item.title;
            cardImage.addEventListener('click', () => {
                openModal(cardImage.src);
            });
            
            const cardDescription = document.createElement('p');
            cardDescription.textContent = item.description;
            
            card.appendChild(cardTitle);
            card.appendChild(cardImage);
            card.appendChild(cardDescription);
            
            contentCards.appendChild(card);
        });
        
        sectionContent.appendChild(sectionHeader);
        sectionContent.appendChild(contentCards);
    } else {
        // 데이터가 없는 경우 기본 메시지 표시
        const message = document.createElement('div');
        message.className = 'section-message';
        
        const title = document.createElement('h2');
        title.textContent = `${section}. ${tocData[section].title}`;
        
        const description = document.createElement('p');
        description.textContent = '이 섹션의 상세 내용은 준비 중입니다.';
        
        message.appendChild(title);
        message.appendChild(description);
        
        sectionContent.appendChild(message);
    }
}

// 항목 콘텐츠 업데이트 함수
function updateItemContent(itemNumber) {
    // 추후 구현
}

// 모달 열기 함수
function openModal(imageSrc) {
    modalImage.src = imageSrc;
    modal.classList.add('active');
}

// 이미지 로드 오류 처리
function handleImageError(img) {
    img.onerror = null;
    img.src = 'images/placeholder.png';
}
