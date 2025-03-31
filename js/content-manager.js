// 섹션 데이터 로드 및 관리를 위한 스크립트
const contentManager = {
    // 모든 섹션 데이터를 저장할 객체
    sectionsData: {},
    
    // baseURL 설정 - 로컬 개발용 루트 경로로 설정
    baseURL: '',
    
    // TXT 파일 로딩 캐시
    contentCache: {},
    
    // 초기화 함수
    init: async function() {
        try {
            // 콘솔에 디버그 메시지 추가
            console.log('콘텐츠 관리자 초기화 시작...');
            console.log('현재 경로:', window.location.pathname);
            
            // baseURL 설정 (GitHub Pages와 로컬 환경 모두 지원)
            this.baseURL = window.location.pathname.includes('/hi-learning') 
                ? '/hi-learning/' 
                : '/';
            
            console.log('설정된 baseURL:', this.baseURL);
            
            // 모든 섹션 데이터 로드
            await this.loadAllSectionsData();
            console.log('모든 섹션 데이터 로드 완료');
            
            // 콘텐츠 표시 초기화
            this.initContentDisplay();
        } catch (error) {
            console.error('콘텐츠 관리자 초기화 오류:', error);
        }
    },
    
    // 모든 섹션 데이터 로드
    loadAllSectionsData: async function() {
        const sections = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
        let loadedCount = 0;
        
        for (const section of sections) {
            try {
                // 상대 경로 사용
                const sectionPath = `content_web/${section}/section_data.json`;
                console.log(`섹션 데이터 로드 시도: ${sectionPath}`);
                
                const response = await fetch(sectionPath);
                if (!response.ok) {
                    throw new Error(`섹션 ${section} 데이터 로드 실패: ${response.status}`);
                }
                
                const data = await response.json();
                this.sectionsData[section] = data;
                
                // 텍스트 파일 참조가 있으면 미리 로드
                await this.preloadTextContent(section, data);
                
                loadedCount++;
                console.log(`섹션 ${section} 데이터 로드 성공 (${loadedCount}/${sections.length})`);
            } catch (error) {
                console.error(`섹션 ${section} 데이터 로드 오류:`, error);
            }
        }
    },
    
    // 텍스트 콘텐츠 사전 로드
    preloadTextContent: async function(sectionId, sectionData) {
        if (!sectionData || !sectionData.subsections) return;
        
        for (const subsection of sectionData.subsections) {
            // 콘텐츠 경로에 .txt 확장자가 있는지 확인
            if (typeof subsection.content === 'string' && subsection.content.includes('.txt')) {
                try {
                    const txtPath = `content_web/${sectionId}/${subsection.content}`;
                    console.log(`텍스트 파일 로드 시도: ${txtPath}`);
                    
                    const response = await fetch(txtPath);
                    if (!response.ok) {
                        throw new Error(`텍스트 파일 로드 실패: ${response.status}`);
                    }
                    
                    const content = await response.text();
                    this.contentCache[txtPath] = content;
                    subsection.content = content; // 직접 콘텐츠로 대체
                    
                    console.log(`텍스트 파일 로드 성공: ${txtPath}`);
                } catch (error) {
                    console.error(`텍스트 파일 로드 오류:`, error);
                }
            }
        }
    },
    
    // 콘텐츠 표시 초기화
    initContentDisplay: function() {
        // 섹션 변경 이벤트 리스너 추가
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.displaySection(section);
            });
        });
    },
    
    // 섹션 표시
    displaySection: function(sectionId) {
        // 네비게이션 메뉴 활성화 상태 업데이트
        document.querySelectorAll('.nav-list a').forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // 웰컴 스크린 숨기기
        document.getElementById('welcome-screen').classList.remove('active');
        
        // 섹션 데이터 가져오기
        const sectionData = this.sectionsData[sectionId];
        if (!sectionData) {
            console.error(`섹션 ${sectionId} 데이터를 찾을 수 없습니다.`);
            return;
        }
        
        // 사이드바 제목 업데이트
        document.querySelector('.section-title').textContent = sectionData.title;
        
        // 사이드바 하위 메뉴 업데이트
        this.updateSubMenu(sectionId, sectionData);
        
        // 섹션 콘텐츠 업데이트
        this.updateSectionContent(sectionId, sectionData);
    },
    
    // 사이드바 하위 메뉴 업데이트
    updateSubMenu: function(sectionId, sectionData) {
        const subMenu = document.querySelector('.sub-menu');
        subMenu.innerHTML = '';
        
        sectionData.subsections.forEach(subsection => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = `${subsection.number} ${subsection.title}`;
            a.setAttribute('data-section', sectionId);
            a.setAttribute('data-subsection', subsection.number);
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.displaySubsection(sectionId, subsection.number);
            });
            
            li.appendChild(a);
            subMenu.appendChild(li);
        });
        
        // 첫 번째 하위 섹션 표시
        if (sectionData.subsections.length > 0) {
            this.displaySubsection(sectionId, sectionData.subsections[0].number);
        }
    },
    
    // 섹션 콘텐츠 업데이트
    updateSectionContent: function(sectionId, sectionData) {
        const sectionContent = document.getElementById('section-content');
        sectionContent.innerHTML = '';
        sectionContent.classList.add('active');
        
        // 섹션 헤더 생성
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = `${sectionId}. ${sectionData.title}`;
        
        sectionHeader.appendChild(sectionTitle);
        sectionContent.appendChild(sectionHeader);
        
        // 하위 섹션 콘텐츠 컨테이너 생성
        const subsectionContainer = document.createElement('div');
        subsectionContainer.id = 'subsection-container';
        sectionContent.appendChild(subsectionContainer);
    },
    
    // 하위 섹션 표시
    displaySubsection: function(sectionId, subsectionNumber) {
        // 사이드바 하위 메뉴 활성화 상태 업데이트
        document.querySelectorAll('.sub-menu a').forEach(link => {
            if (link.getAttribute('data-section') === sectionId && 
                link.getAttribute('data-subsection') === subsectionNumber) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // 섹션 데이터 가져오기
        const sectionData = this.sectionsData[sectionId];
        if (!sectionData) {
            console.error(`섹션 ${sectionId} 데이터를 찾을 수 없습니다.`);
            return;
        }
        
        // 하위 섹션 데이터 찾기
        const subsection = sectionData.subsections.find(sub => sub.number === subsectionNumber);
        if (!subsection) {
            console.error(`하위 섹션 ${subsectionNumber} 데이터를 찾을 수 없습니다.`);
            return;
        }
        
        // 하위 섹션 콘텐츠 컨테이너 가져오기
        const subsectionContainer = document.getElementById('subsection-container');
        subsectionContainer.innerHTML = '';
        
        // 하위 섹션 제목 생성
        const subsectionTitle = document.createElement('h3');
        subsectionTitle.className = 'subsection-title';
        subsectionTitle.textContent = `${subsection.number} ${subsection.title}`;
        subsectionContainer.appendChild(subsectionTitle);
        
        // 하위 섹션 콘텐츠 생성
        const contentDiv = document.createElement('div');
        contentDiv.className = 'subsection-content';
        
        // 내용이 없거나 빈 문자열이면 처리
        let contentText = '내용이 없습니다.';
        
        if (subsection.content) {
            // 내용 처리 (특수 문자와 줄바꿈 처리 개선)
            contentText = subsection.content
                .replace(/\s+/g, ' ')  // 연속된 공백을 하나로 통일
                .replace(/\\n/g, '<br>')  // 이스케이프된 줄바꿈 처리
                .replace(/\n/g, '<br>');  // 일반 줄바꿈 처리
        }
        
        // 이미지 갤러리 생성
        let imagesHtml = '';
        if (subsection.images && subsection.images.length > 0) {
            imagesHtml = '<div class="image-gallery">';
            subsection.images.forEach(image => {
                // 이미지 경로 처리 개선 - 상대 경로 유지
                let imageUrl = image;
                if (!image.startsWith('http') && !image.startsWith('/')) {
                    imageUrl = image; // 상대 경로 유지
                }
                
                console.log('이미지 로드 시도:', imageUrl);
                
                imagesHtml += `
                    <div class="gallery-item">
                        <img src="${imageUrl}" alt="${subsection.title}" loading="lazy" onerror="this.onerror=null; this.src='images_web/error.png'; console.error('이미지 로드 실패:',this.src);" onclick="openModal(this.src)">
                    </div>
                `;
            });
            imagesHtml += '</div>';
        }
        
        // 내용과 이미지 갤러리 추가
        contentDiv.innerHTML = `
            <div class="content-text">${contentText}</div>
            ${imagesHtml}
        `;
        
        subsectionContainer.appendChild(contentDiv);
        
        // 콘솔에 디버그 정보 출력
        console.log('섹션 데이터 로드됨:', {
            sectionId,
            subsectionNumber,
            contentLength: contentText.length,
            imagesCount: subsection.images?.length || 0,
            imageURLs: subsection.images
        });
    }
};

// 모달 이미지 열기 함수
function openModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    
    modalImage.src = imageSrc;
    modal.classList.add('active');
}

// 페이지 로드 시 콘텐츠 관리자 초기화
document.addEventListener('DOMContentLoaded', function() {
    contentManager.init();
});
