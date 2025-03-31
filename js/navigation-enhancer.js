// 네비게이션 시스템 강화 스크립트
const navigationEnhancer = {
    // 초기화 함수
    init: function() {
        // 진행 표시기 추가
        this.addProgressIndicator();
        
        // 경로 표시 기능 추가
        this.addBreadcrumbNavigation();
        
        // 네비게이션 아이콘 추가
        this.enhanceNavigationIcons();
        
        // 스크롤 위치 기억 기능
        this.setupScrollMemory();
        
        // 키보드 네비게이션 개선
        this.enhanceKeyboardNavigation();
        
        console.log('네비게이션 강화 시스템 초기화 완료');
    },
    
    // 진행 표시기 추가
    addProgressIndicator: function() {
        // 진행 표시기 요소 생성
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';
        document.body.appendChild(progressIndicator);
        
        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 스크롤 진행률 계산
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            // 진행 표시기 업데이트
            progressIndicator.style.width = scrollPercent + '%';
        });
    },
    
    // 경로 표시 기능 추가
    addBreadcrumbNavigation: function() {
        // 섹션 콘텐츠 업데이트 함수 확장
        const originalUpdateSectionContent = contentManager.updateSectionContent;
        contentManager.updateSectionContent = function(sectionId, sectionData) {
            // 원래 함수 호출
            originalUpdateSectionContent.call(this, sectionId, sectionData);
            
            // 경로 표시 요소 생성
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'breadcrumb';
            breadcrumb.innerHTML = `
                <div class="breadcrumb-item">
                    <a href="#" onclick="document.getElementById('welcome-screen').classList.add('active'); document.getElementById('section-content').classList.remove('active'); return false;">
                        <i class="fas fa-home"></i> 홈
                    </a>
                </div>
                <div class="breadcrumb-item active">
                    ${sectionId}. ${sectionData.title}
                </div>
            `;
            
            // 섹션 콘텐츠에 경로 표시 추가
            const sectionContent = document.getElementById('section-content');
            const sectionHeader = sectionContent.querySelector('.section-header');
            sectionHeader.insertBefore(breadcrumb, sectionHeader.firstChild);
        };
        
        // 하위 섹션 표시 함수 확장
        const originalDisplaySubsection = contentManager.displaySubsection;
        contentManager.displaySubsection = function(sectionId, subsectionNumber) {
            // 원래 함수 호출
            originalDisplaySubsection.call(this, sectionId, subsectionNumber);
            
            // 섹션 데이터 가져오기
            const sectionData = this.sectionsData[sectionId];
            if (!sectionData) return;
            
            // 하위 섹션 데이터 찾기
            const subsection = sectionData.subsections.find(sub => sub.number === subsectionNumber);
            if (!subsection) return;
            
            // 경로 표시 업데이트
            const breadcrumb = document.querySelector('.breadcrumb');
            if (breadcrumb) {
                breadcrumb.innerHTML = `
                    <div class="breadcrumb-item">
                        <a href="#" onclick="document.getElementById('welcome-screen').classList.add('active'); document.getElementById('section-content').classList.remove('active'); return false;">
                            <i class="fas fa-home"></i> 홈
                        </a>
                    </div>
                    <div class="breadcrumb-item">
                        <a href="#" onclick="contentManager.displaySection('${sectionId}'); return false;">
                            ${sectionId}. ${sectionData.title}
                        </a>
                    </div>
                    <div class="breadcrumb-item active">
                        ${subsection.number} ${subsection.title}
                    </div>
                `;
            }
        };
    },
    
    // 네비게이션 아이콘 추가
    enhanceNavigationIcons: function() {
        // 네비게이션 메뉴에 데이터 속성 추가
        document.querySelectorAll('.nav-list a').forEach((link, index) => {
            link.setAttribute('data-section', String(index).padStart(2, '0'));
        });
    },
    
    // 스크롤 위치 기억 기능
    setupScrollMemory: function() {
        // 섹션 및 하위 섹션 ID별 스크롤 위치 저장 객체
        const scrollPositions = {};
        
        // 하위 섹션 표시 함수 확장
        const originalDisplaySubsection = contentManager.displaySubsection;
        contentManager.displaySubsection = function(sectionId, subsectionNumber) {
            // 현재 스크롤 위치 저장
            const currentId = document.querySelector('.sub-menu a.active');
            if (currentId) {
                const currentSectionId = currentId.getAttribute('data-section');
                const currentSubsectionId = currentId.getAttribute('data-subsection');
                if (currentSectionId && currentSubsectionId) {
                    const key = `${currentSectionId}-${currentSubsectionId}`;
                    scrollPositions[key] = window.scrollY;
                }
            }
            
            // 원래 함수 호출
            originalDisplaySubsection.call(this, sectionId, subsectionNumber);
            
            // 저장된 스크롤 위치로 이동
            const key = `${sectionId}-${subsectionNumber}`;
            if (scrollPositions[key]) {
                setTimeout(() => {
                    window.scrollTo(0, scrollPositions[key]);
                }, 100);
            } else {
                // 저장된 위치가 없으면 맨 위로 스크롤
                window.scrollTo(0, 0);
            }
        };
    },
    
    // 키보드 네비게이션 개선
    enhanceKeyboardNavigation: function() {
        // 키보드 이벤트 리스너 추가
        document.addEventListener('keydown', function(e) {
            // 현재 활성화된 하위 섹션 링크 찾기
            const activeLink = document.querySelector('.sub-menu a.active');
            if (!activeLink) return;
            
            const sectionId = activeLink.getAttribute('data-section');
            const subsectionNumber = activeLink.getAttribute('data-subsection');
            
            // 섹션 데이터 가져오기
            const sectionData = contentManager.sectionsData[sectionId];
            if (!sectionData) return;
            
            // 하위 섹션 인덱스 찾기
            const subsections = sectionData.subsections;
            const currentIndex = subsections.findIndex(sub => sub.number === subsectionNumber);
            if (currentIndex === -1) return;
            
            // 왼쪽 화살표 키: 이전 하위 섹션으로 이동
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                
                // 이전 하위 섹션이 있는 경우
                if (currentIndex > 0) {
                    const prevSubsection = subsections[currentIndex - 1];
                    window.navigateToSubsection(sectionId, prevSubsection.number);
                } 
                // 이전 섹션의 마지막 하위 섹션으로 이동
                else {
                    const sections = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                    const currentSectionIndex = sections.indexOf(sectionId);
                    
                    if (currentSectionIndex > 0) {
                        const prevSectionId = sections[currentSectionIndex - 1];
                        const prevSectionData = contentManager.sectionsData[prevSectionId];
                        
                        if (prevSectionData && prevSectionData.subsections.length > 0) {
                            const lastSubsection = prevSectionData.subsections[prevSectionData.subsections.length - 1];
                            window.navigateToSubsection(prevSectionId, lastSubsection.number);
                        }
                    }
                }
            }
            
            // 오른쪽 화살표 키: 다음 하위 섹션으로 이동
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                
                // 다음 하위 섹션이 있는 경우
                if (currentIndex < subsections.length - 1) {
                    const nextSubsection = subsections[currentIndex + 1];
                    window.navigateToSubsection(sectionId, nextSubsection.number);
                } 
                // 다음 섹션의 첫 번째 하위 섹션으로 이동
                else {
                    const sections = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
                    const currentSectionIndex = sections.indexOf(sectionId);
                    
                    if (currentSectionIndex < sections.length - 1) {
                        const nextSectionId = sections[currentSectionIndex + 1];
                        const nextSectionData = contentManager.sectionsData[nextSectionId];
                        
                        if (nextSectionData && nextSectionData.subsections.length > 0) {
                            const firstSubsection = nextSectionData.subsections[0];
                            window.navigateToSubsection(nextSectionId, firstSubsection.number);
                        }
                    }
                }
            }
        });
    }
};

// 페이지 로드 시 네비게이션 강화 시스템 초기화
document.addEventListener('DOMContentLoaded', function() {
    navigationEnhancer.init();
});
