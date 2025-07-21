// 페이지 이동 방식 다국어 시스템

// 언어별 페이지 URL 매핑
const languagePages = {
    ko: 'index.html',
    jp: 'index-jp.html', 
    tw: 'index-tw.html',
    en: 'index-en.html'
};

// 언어 선택 시 해당 페이지로 이동
function redirectToLanguage(lang) {
    console.log(`${lang} 페이지로 이동 중...`);
    
    // 선택한 언어를 로컬스토리지에 저장
    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (e) {
        console.log('언어 설정 저장 실패:', e);
    }
    
    // 해당 언어 페이지로 이동
    if (languagePages[lang]) {
        window.location.href = languagePages[lang];
    } else {
        console.error('존재하지 않는 언어:', lang);
        window.location.href = languagePages.ko; // 기본값: 한국어
    }
}

// 버튼 상태 변경 (시각적 피드백)
function setActiveButton(lang) {
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedButton = document.querySelector(`[data-lang="${lang}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('언어 선택 시스템 초기화 중...');
    
    // 이전에 선택한 언어가 있으면 해당 버튼을 활성화
    try {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'ko';
        setActiveButton(savedLanguage);
    } catch (e) {
        console.log('저장된 언어 불러오기 실패:', e);
        setActiveButton('ko');
    }
    
    // 각 언어 버튼에 클릭 이벤트 연결
    document.querySelectorAll('.language-btn').forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            console.log('언어 버튼 클릭:', selectedLang);
            
            // 시각적 피드백 (버튼 활성화)
            setActiveButton(selectedLang);
            
            // 잠시 후 페이지 이동 (애니메이션 보여주기 위해)
            setTimeout(() => {
                redirectToLanguage(selectedLang);
            }, 300);
        });
    });
    
    console.log('언어 선택 시스템 초기화 완료!');
});