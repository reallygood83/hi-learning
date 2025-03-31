// 검색 기능 구현 스크립트
const searchManager = {
    // 검색 인덱스
    searchIndex: {},
    
    // 초기화 함수
    init: async function() {
        try {
            // 검색 UI 추가
            this.addSearchUI();
            
            // 검색 인덱스 구축
            await this.buildSearchIndex();
            
            // 검색 이벤트 리스너 설정
            this.setupSearchEventListeners();
            
            // 키보드 단축키 설정
            this.setupKeyboardShortcuts();
            
            console.log('검색 관리자 초기화 완료');
        } catch (error) {
            console.error('검색 관리자 초기화 오류:', error);
        }
    },
    
    // 검색 UI 추가
    addSearchUI: function() {
        // 헤더에 검색 컨테이너 추가
        const header = document.querySelector('header');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" placeholder="하이러닝 가이드 검색..." aria-label="검색">
            <span class="search-shortcut">Ctrl + K</span>
            <div class="search-filters">
                <span class="search-filter active" data-filter="all">전체</span>
                <span class="search-filter" data-filter="title">제목</span>
                <span class="search-filter" data-filter="content">내용</span>
            </div>
            <div class="search-results">
                <ul class="search-results-list"></ul>
            </div>
        `;
        
        header.appendChild(searchContainer);
    },
    
    // 검색 인덱스 구축
    buildSearchIndex: async function() {
        const sections = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
        
        for (const section of sections) {
            try {
                // 섹션 데이터 로드
                const response = await fetch(`content_web/${section}/section_data.json`);
                if (!response.ok) {
                    throw new Error(`섹션 ${section} 데이터 로드 실패: ${response.status}`);
                }
                
                const sectionData = await response.json();
                
                // 섹션 제목 인덱싱
                this.searchIndex[`${section}_title`] = {
                    type: 'section',
                    section: section,
                    title: sectionData.title,
                    content: sectionData.title,
                    path: `${section}. ${sectionData.title}`
                };
                
                // 하위 섹션 인덱싱
                sectionData.subsections.forEach(subsection => {
                    // 하위 섹션 제목 인덱싱
                    this.searchIndex[`${section}_${subsection.number}_title`] = {
                        type: 'subsection',
                        section: section,
                        subsection: subsection.number,
                        title: subsection.title,
                        content: subsection.title,
                        path: `${section}. ${sectionData.title} > ${subsection.number} ${subsection.title}`
                    };
                    
                    // 하위 섹션 내용 인덱싱
                    this.searchIndex[`${section}_${subsection.number}_content`] = {
                        type: 'content',
                        section: section,
                        subsection: subsection.number,
                        title: `${subsection.number} ${subsection.title}`,
                        content: subsection.content,
                        path: `${section}. ${sectionData.title} > ${subsection.number} ${subsection.title}`
                    };
                });
            } catch (error) {
                console.error(`섹션 ${section} 인덱싱 오류:`, error);
            }
        }
        
        console.log('검색 인덱스 구축 완료:', Object.keys(this.searchIndex).length, '항목');
    },
    
    // 검색 이벤트 리스너 설정
    setupSearchEventListeners: function() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        const searchResultsList = document.querySelector('.search-results-list');
        const searchFilters = document.querySelectorAll('.search-filter');
        
        // 현재 선택된 필터
        let currentFilter = 'all';
        
        // 검색 입력 이벤트
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }
            
            // 검색 실행
            const results = this.search(query, currentFilter);
            
            // 검색 결과 표시
            this.displaySearchResults(results, query);
        });
        
        // 검색 입력 포커스 이벤트
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.trim();
            
            if (query.length >= 2) {
                searchResults.classList.add('active');
            }
        });
        
        // 검색 입력 블러 이벤트 (클릭 이벤트 처리를 위해 지연)
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchResults.classList.remove('active');
            }, 200);
        });
        
        // 검색 필터 클릭 이벤트
        searchFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // 현재 필터 업데이트
                currentFilter = filter.getAttribute('data-filter');
                
                // 필터 활성화 상태 업데이트
                searchFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                // 검색 결과 업데이트
                const query = searchInput.value.trim();
                
                if (query.length >= 2) {
                    const results = this.search(query, currentFilter);
                    this.displaySearchResults(results, query);
                }
            });
        });
        
        // 문서 클릭 이벤트 (검색 결과 외부 클릭 시 닫기)
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('active');
            }
        });
    },
    
    // 키보드 단축키 설정
    setupKeyboardShortcuts: function() {
        const searchInput = document.querySelector('.search-input');
        
        // Ctrl + K 단축키로 검색 포커스
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // ESC 키로 검색 결과 닫기
            if (e.key === 'Escape') {
                document.querySelector('.search-results').classList.remove('active');
                searchInput.blur();
            }
        });
    },
    
    // 검색 실행
    search: function(query, filter) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        // 검색 인덱스 순회
        for (const key in this.searchIndex) {
            const item = this.searchIndex[key];
            
            // 필터 적용
            if (filter !== 'all') {
                if (filter === 'title' && !key.includes('_title')) continue;
                if (filter === 'content' && !key.includes('_content')) continue;
            }
            
            // 검색어 매칭
            const titleLower = item.title.toLowerCase();
            const contentLower = item.content.toLowerCase();
            
            if (titleLower.includes(queryLower) || contentLower.includes(queryLower)) {
                // 검색 결과 스니펫 생성
                let snippet = '';
                
                if (contentLower.includes(queryLower)) {
                    const index = contentLower.indexOf(queryLower);
                    const start = Math.max(0, index - 50);
                    const end = Math.min(contentLower.length, index + queryLower.length + 50);
                    snippet = item.content.substring(start, end);
                    
                    // 시작/끝 부분에 ... 추가
                    if (start > 0) snippet = '...' + snippet;
                    if (end < contentLower.length) snippet = snippet + '...';
                }
                
                results.push({
                    key: key,
                    item: item,
                    snippet: snippet
                });
            }
        }
        
        return results;
    },
    
    // 검색 결과 표시
    displaySearchResults: function(results, query) {
        const searchResults = document.querySelector('.search-results');
        const searchResultsList = document.querySelector('.search-results-list');
        
        // 검색 결과 목록 초기화
        searchResultsList.innerHTML = '';
        
        if (results.length === 0) {
            // 검색 결과가 없는 경우
            searchResultsList.innerHTML = `
                <li class="search-no-results">
                    "${query}"에 대한 검색 결과가 없습니다.
                </li>
            `;
        } else {
            // 검색 결과 표시 (최대 10개)
            results.slice(0, 10).forEach(result => {
                const li = document.createElement('li');
                li.className = 'search-result-item';
                
                // 검색어 하이라이트 처리
                const titleHighlighted = this.highlightText(result.item.title, query);
                const snippetHighlighted = result.snippet ? this.highlightText(result.snippet, query) : '';
                
                li.innerHTML = `
                    <div class="search-result-title">${titleHighlighted}</div>
                    <div class="search-result-path">${result.item.path}</div>
                    ${snippetHighlighted ? `<div class="search-result-snippet">${snippetHighlighted}</div>` : ''}
                `;
                
                // 검색 결과 클릭 이벤트
                li.addEventListener('click', () => {
                    // 검색 결과로 이동
                    if (result.item.type === 'section') {
                        window.navigateToSection(result.item.section);
                    } else {
                        window.navigateToSubsection(result.item.section, result.item.subsection);
                    }
                    
                    // 검색 결과 닫기
                    searchResults.classList.remove('active');
                });
                
                searchResultsList.appendChild(li);
            });
            
            // 검색 결과가 10개 이상인 경우 안내 메시지 추가
            if (results.length > 10) {
                const li = document.createElement('li');
                li.className = 'search-no-results';
                li.textContent = `총 ${results.length}개 결과 중 10개 표시`;
                searchResultsList.appendChild(li);
            }
        }
        
        // 검색 결과 표시
        searchResults.classList.add('active');
    },
    
    // 텍스트에서 검색어 하이라이트 처리
    highlightText: function(text, query) {
        const queryLower = query.toLowerCase();
        const textLower = text.toLowerCase();
        
        let result = '';
        let lastIndex = 0;
        
        // 모든 검색어 출현 위치 찾기
        let index = textLower.indexOf(queryLower);
        
        while (index !== -1) {
            // 검색어 앞 부분 추가
            result += text.substring(lastIndex, index);
            
            // 검색어 하이라이트 처리
            result += `<span class="search-highlight">${text.substring(index, index + query.length)}</span>`;
            
            // 다음 검색 위치 업데이트
            lastIndex = index + query.length;
            index = textLower.indexOf(queryLower, lastIndex);
        }
        
        // 나머지 부분 추가
        result += text.substring(lastIndex);
        
        return result;
    }
};

// 페이지 로드 시 검색 관리자 초기화
document.addEventListener('DOMContentLoaded', function() {
    searchManager.init();
});
