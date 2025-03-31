// 콘텐츠 페이지 구현 스크립트
// 이 스크립트는 하이러닝 가이드의 실제 내용을 웹앱에 표시하는 기능을 구현합니다.

// 콘텐츠 렌더링 관리자
const contentRenderer = {
    // 초기화 함수
    init: function() {
        // 콘텐츠 로딩 상태 표시 요소 추가
        this.addLoadingIndicator();
        
        // 콘텐츠 네비게이션 기능 추가
        this.setupContentNavigation();
        
        // 콘텐츠 목차 기능 추가
        this.setupTableOfContents();
        
        // 이미지 확대 기능 개선
        this.enhanceImageViewer();
        
        console.log('콘텐츠 렌더링 관리자 초기화 완료');
    },
    
    // 콘텐츠 로딩 상태 표시 요소 추가
    addLoadingIndicator: function() {
        // 콘텐츠 영역에 로딩 인디케이터 추가
        const sectionContent = document.getElementById('section-content');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'content-loading';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p class="loading-text">콘텐츠를 불러오는 중입니다...</p>
        `;
        loadingIndicator.id = 'content-loading';
        loadingIndicator.style.display = 'none';
        sectionContent.appendChild(loadingIndicator);
        
        // 콘텐츠 로딩 시작/종료 함수 정의
        window.startContentLoading = function() {
            document.getElementById('content-loading').style.display = 'flex';
        };
        
        window.stopContentLoading = function() {
            document.getElementById('content-loading').style.display = 'none';
        };
    },
    
    // 콘텐츠 네비게이션 기능 추가
    setupContentNavigation: function() {
        // 섹션 간 이동 함수 정의
        window.navigateToSection = function(sectionId) {
            // 네비게이션 메뉴 클릭 이벤트 트리거
            const navLink = document.querySelector(`.nav-list a[data-section="${sectionId}"]`);
            if (navLink) {
                navLink.click();
            }
        };
        
        // 하위 섹션 간 이동 함수 정의
        window.navigateToSubsection = function(sectionId, subsectionNumber) {
            // 먼저 섹션으로 이동
            window.navigateToSection(sectionId);
            
            // 약간의 지연 후 하위 섹션으로 이동
            setTimeout(() => {
                const subLink = document.querySelector(`.sub-menu a[data-section="${sectionId}"][data-subsection="${subsectionNumber}"]`);
                if (subLink) {
                    subLink.click();
                }
            }, 300);
        };
        
        // 이전/다음 네비게이션 버튼 추가 함수 정의
        window.addNavigationButtons = function(sectionId, subsectionNumber) {
            const subsectionContainer = document.getElementById('subsection-container');
            if (!subsectionContainer) return;
            
            // 이전에 추가된 네비게이션 버튼 제거
            const existingNav = document.querySelector('.content-navigation');
            if (existingNav) {
                existingNav.remove();
            }
            
            // 네비게이션 컨테이너 생성
            const navContainer = document.createElement('div');
            navContainer.className = 'content-navigation';
            
            // 섹션 및 하위 섹션 정보 가져오기
            const sections = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
            const currentSectionIndex = sections.indexOf(sectionId);
            
            // 현재 섹션의 하위 섹션 목록 가져오기
            const currentSectionData = contentManager.sectionsData[sectionId];
            if (!currentSectionData) return;
            
            const subsections = currentSectionData.subsections;
            const currentSubsectionIndex = subsections.findIndex(sub => sub.number === subsectionNumber);
            
            // 이전 버튼 생성
            const prevButton = document.createElement('a');
            prevButton.className = 'nav-prev';
            prevButton.href = '#';
            
            // 다음 버튼 생성
            const nextButton = document.createElement('a');
            nextButton.className = 'nav-next';
            nextButton.href = '#';
            
            // 이전 하위 섹션이 있는 경우
            if (currentSubsectionIndex > 0) {
                const prevSubsection = subsections[currentSubsectionIndex - 1];
                prevButton.innerHTML = `<i class="fas fa-arrow-left"></i> 이전: ${prevSubsection.number} ${prevSubsection.title}`;
                prevButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.navigateToSubsection(sectionId, prevSubsection.number);
                });
            } 
            // 이전 섹션의 마지막 하위 섹션으로 이동
            else if (currentSectionIndex > 0) {
                const prevSectionId = sections[currentSectionIndex - 1];
                const prevSectionData = contentManager.sectionsData[prevSectionId];
                if (prevSectionData && prevSectionData.subsections.length > 0) {
                    const lastSubsection = prevSectionData.subsections[prevSectionData.subsections.length - 1];
                    prevButton.innerHTML = `<i class="fas fa-arrow-left"></i> 이전: ${prevSectionId}.${lastSubsection.number} ${lastSubsection.title}`;
                    prevButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        window.navigateToSubsection(prevSectionId, lastSubsection.number);
                    });
                } else {
                    prevButton.style.visibility = 'hidden';
                }
            } else {
                prevButton.style.visibility = 'hidden';
            }
            
            // 다음 하위 섹션이 있는 경우
            if (currentSubsectionIndex < subsections.length - 1) {
                const nextSubsection = subsections[currentSubsectionIndex + 1];
                nextButton.innerHTML = `다음: ${nextSubsection.number} ${nextSubsection.title} <i class="fas fa-arrow-right"></i>`;
                nextButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.navigateToSubsection(sectionId, nextSubsection.number);
                });
            } 
            // 다음 섹션의 첫 번째 하위 섹션으로 이동
            else if (currentSectionIndex < sections.length - 1) {
                const nextSectionId = sections[currentSectionIndex + 1];
                const nextSectionData = contentManager.sectionsData[nextSectionId];
                if (nextSectionData && nextSectionData.subsections.length > 0) {
                    const firstSubsection = nextSectionData.subsections[0];
                    nextButton.innerHTML = `다음: ${nextSectionId}.${firstSubsection.number} ${firstSubsection.title} <i class="fas fa-arrow-right"></i>`;
                    nextButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        window.navigateToSubsection(nextSectionId, firstSubsection.number);
                    });
                } else {
                    nextButton.style.visibility = 'hidden';
                }
            } else {
                nextButton.style.visibility = 'hidden';
            }
            
            // 네비게이션 버튼 추가
            navContainer.appendChild(prevButton);
            navContainer.appendChild(nextButton);
            subsectionContainer.appendChild(navContainer);
        };
    },
    
    // 콘텐츠 목차 기능 추가
    setupTableOfContents: function() {
        // 목차 생성 함수 정의
        window.generateTableOfContents = function(sectionId) {
            const sectionData = contentManager.sectionsData[sectionId];
            if (!sectionData) return '';
            
            let tocHtml = `
                <div class="content-toc">
                    <h4>목차</h4>
                    <ul>
            `;
            
            sectionData.subsections.forEach(subsection => {
                tocHtml += `
                    <li>
                        <a href="#" onclick="navigateToSubsection('${sectionId}', '${subsection.number}'); return false;">
                            ${subsection.number} ${subsection.title}
                        </a>
                    </li>
                `;
            });
            
            tocHtml += `
                    </ul>
                </div>
            `;
            
            return tocHtml;
        };
        
        // 섹션 콘텐츠 업데이트 함수 확장
        const originalUpdateSectionContent = contentManager.updateSectionContent;
        contentManager.updateSectionContent = function(sectionId, sectionData) {
            // 원래 함수 호출
            originalUpdateSectionContent.call(this, sectionId, sectionData);
            
            // 목차 추가
            const sectionContent = document.getElementById('section-content');
            const subsectionContainer = document.getElementById('subsection-container');
            
            // 목차 HTML 생성
            const tocHtml = window.generateTableOfContents(sectionId);
            
            // 목차 요소 생성 및 추가
            const tocElement = document.createElement('div');
            tocElement.innerHTML = tocHtml;
            
            // 하위 섹션 컨테이너 앞에 목차 삽입
            sectionContent.insertBefore(tocElement.firstChild, subsectionContainer);
        };
    },
    
    // 이미지 확대 기능 개선
    enhanceImageViewer: function() {
        // 이미지 확대 함수 재정의
        window.openModal = function(imageSrc) {
            const modal = document.getElementById('image-modal');
            const modalImage = document.getElementById('modal-image');
            
            // 로딩 표시
            modal.classList.add('loading');
            
            // 이미지 로드
            modalImage.onload = function() {
                modal.classList.remove('loading');
            };
            
            modalImage.src = imageSrc;
            modal.classList.add('active');
            
            // 이미지 확대/축소 기능 추가
            let scale = 1;
            modalImage.style.transform = `scale(${scale})`;
            
            // 확대/축소 버튼 추가
            const zoomControls = document.createElement('div');
            zoomControls.className = 'zoom-controls';
            zoomControls.innerHTML = `
                <button class="zoom-in"><i class="fas fa-search-plus"></i></button>
                <button class="zoom-out"><i class="fas fa-search-minus"></i></button>
                <button class="zoom-reset"><i class="fas fa-undo"></i></button>
            `;
            
            // 기존 컨트롤이 있으면 제거
            const existingControls = modal.querySelector('.zoom-controls');
            if (existingControls) {
                existingControls.remove();
            }
            
            modal.querySelector('.modal-content').appendChild(zoomControls);
            
            // 확대 버튼 이벤트
            zoomControls.querySelector('.zoom-in').addEventListener('click', function() {
                scale += 0.2;
                modalImage.style.transform = `scale(${scale})`;
            });
            
            // 축소 버튼 이벤트
            zoomControls.querySelector('.zoom-out').addEventListener('click', function() {
                if (scale > 0.5) {
                    scale -= 0.2;
                    modalImage.style.transform = `scale(${scale})`;
                }
            });
            
            // 리셋 버튼 이벤트
            zoomControls.querySelector('.zoom-reset').addEventListener('click', function() {
                scale = 1;
                modalImage.style.transform = `scale(${scale})`;
            });
        };
    }
};

// 하위 섹션 표시 함수 확장
const originalDisplaySubsection = contentManager.displaySubsection;
contentManager.displaySubsection = function(sectionId, subsectionNumber) {
    // 원래 함수 호출
    originalDisplaySubsection.call(this, sectionId, subsectionNumber);
    
    // 네비게이션 버튼 추가
    window.addNavigationButtons(sectionId, subsectionNumber);
};

// 페이지 로드 시 콘텐츠 렌더링 관리자 초기화
document.addEventListener('DOMContentLoaded', function() {
    contentRenderer.init();
});
