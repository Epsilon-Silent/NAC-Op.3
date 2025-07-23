// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 음표 애니메이션 무한 생성
    createMusicNotes();
    
    // 스크롤 시 헤더 효과
    handleScrollEffect();
    
    // 페이지 전환 효과
    addPageTransition();
});

// 음표 애니메이션 생성 함수
function createMusicNotes() {
    const notesContainer = document.querySelector('.music-notes');
    const notes = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
    
    // 3초마다 새로운 음표 생성
    setInterval(() => {
        const note = document.createElement('span');
        note.className = 'note';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.left = Math.random() * 100 + '%';
        note.style.animationDuration = (Math.random() * 10 + 10) + 's';
        note.style.opacity = Math.random() * 0.3 + 0.1;
        note.style.fontSize = (Math.random() * 20 + 20) + 'px';
        
        notesContainer.appendChild(note);
        
        // 애니메이션 끝나면 음표 제거
        setTimeout(() => {
            note.remove();
        }, 20000);
    }, 3000);
}

// 스크롤 효과 함수
function handleScrollEffect() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // 스크롤 시 헤더 배경 투명도 변경
        if (scrolled > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.05)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// 페이지 전환 효과
function addPageTransition() {
    // 모든 네비게이션 링크에 클릭 이벤트 추가
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 외부 링크가 아닌 경우에만 효과 적용
            if (!this.target && this.href.includes(window.location.hostname)) {
                e.preventDefault();
                const href = this.href;
                
                // 페이드 아웃 효과
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.5s ease';
                
                // 0.5초 후 페이지 이동
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
}

// 참가신청 버튼 호버 효과 강화
const applyButton = document.querySelector('.apply-button');
if (applyButton) {
    applyButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    applyButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// 하이라이트 카드 순차적 등장 애니메이션
const cards = document.querySelectorAll('.highlight-card');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    
    // 순차적으로 나타나기
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 200 * (index + 1));
});

// 콘솔에 이스터에그 메시지
console.log('삿포로는 너무 추워');

// 이스터에그 1: Konami Code (↑↑↓↓←→←→BA)
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // 커맨드 창 생성!
            createCommandConsole();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// 커맨드 콘솔 생성 함수
function createCommandConsole() {
    // 이미 콘솔이 있으면 제거
    const existingConsole = document.getElementById('secret-console');
    if (existingConsole) {
        existingConsole.remove();
        return;
    }
    
    // 콘솔 HTML 생성
    const consoleHTML = `
        <div id="secret-console" class="command-console">
            <div class="console-header">
                <span>🎮 NOSTALGIA Op.3 Secret Console</span>
                <button class="console-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="console-output">
                <p>KONAMI Code Accepted! 🎯</p>
                <p>Secret Console Activated...</p>
                <p>Type 'help' for available commands</p>
                <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            </div>
            <div class="console-input-wrapper">
                <span class="console-prompt">&gt;</span>
                <input type="text" class="console-input" id="console-input" autofocus>
            </div>
        </div>
    `;
    
    // 콘솔을 body에 추가
    document.body.insertAdjacentHTML('beforeend', consoleHTML);
    
    // 입력 이벤트 설정
    const input = document.getElementById('console-input');
    const output = document.querySelector('.console-output');
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.toLowerCase().trim();
            
            // 입력한 명령어 표시
            output.innerHTML += `<p class="user-command">&gt; ${input.value}</p>`;
            
            // 명령어 처리
            processCommand(command, output);
            
            // 입력 초기화
            input.value = '';
            
            // 스크롤 하단으로
            output.scrollTop = output.scrollHeight;
        }
    });
    
    // 자동 포커스
    input.focus();
}

// 명령어 처리 함수
function processCommand(command, output) {
    const commands = {
        'help': () => {
            output.innerHTML += `
                <p style="color: #ffd700;">Available Commands:</p>
                <p>• help - Show this help message</p>
                <p>• alice - Meet the special guest</p>
                <p>• rainbow - Activate rainbow mode</p>
                <p>• matrix - Enter the matrix</p>
                <p>• scores - Show hidden high scores</p>
                <p>• piano - Play a secret melody</p>
                <p>• clear - Clear console</p>
                <p>• exit - Close console</p>
            `;
        },
        
        'alice': () => {
            output.innerHTML += `
                <p style="color: #87CEEB;">🎮 "안녕하세요, 선생님! 텐도 아리스예요!"</p>
                <p style="color: #87CEEB;">"숨겨진 콘솔을 찾으셨네요! 경험치 +1000!"</p>
            `;
        },
        
        'rainbow': () => {
            document.body.style.animation = 'rainbow 3s linear infinite';
            output.innerHTML += `<p style="color: #ff00ff;">🌈 Rainbow mode activated!</p>`;
            
            // 애니메이션 CSS 추가
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        },
        
        'matrix': () => {
            output.innerHTML += `<p style="color: #00ff00;">Wake up, Neo... The Matrix has you...</p>`;
            document.body.style.fontFamily = 'Courier New, monospace';
            setTimeout(() => {
                document.body.style.fontFamily = '';
            }, 5000);
        },
        
        'scores': () => {
            output.innerHTML += `
                <p style="color: #ffd700;">🏆 Hidden High Scores:</p>
                <p>1. KONAMI - 999,999</p>
                <p>2. ALICE - 777,777</p>
                <p>3. ??? - 555,555</p>
            `;
        },
        
        'piano': () => {
            output.innerHTML += `<p>🎹 Playing secret melody...</p>`;
            // 여기에 오디오 재생 코드를 추가할 수 있어요
            const notes = ['♪', '♫', '♩', '♬'];
            let melody = '';
            for (let i = 0; i < 8; i++) {
                melody += notes[Math.floor(Math.random() * notes.length)] + ' ';
            }
            output.innerHTML += `<p style="color: #ffd700;">${melody}</p>`;
        },
        
        'clear': () => {
            output.innerHTML = '<p>Console cleared.</p>';
        },
        
        'exit': () => {
            document.getElementById('secret-console').remove();
        }
    };
    
    // 명령어 실행
    if (commands[command]) {
        commands[command]();
    } else {
        output.innerHTML += `<p style="color: #ff6b6b;">Unknown command: ${command}</p>`;
        output.innerHTML += `<p>Type 'help' for available commands</p>`;
    }
}

// 이스터에그 2: 로고 5번 클릭
let logoClickCount = 0;
const logo = document.querySelector('.logo-image');
if (logo) {
    logo.addEventListener('click', () => {
        logoClickCount++;
        if (logoClickCount === 5) {
            logo.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                alert('🎹 숨겨진 피아니스트를 발견하셨군요! 🎹');
                logo.style.animation = '';
            }, 1000);
            logoClickCount = 0;
        }
    });
}

// spin 애니메이션 추가
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }
`;
document.head.appendChild(spinStyle);

// 이스터에그 3: 특정 이름 입력 시 (순위표에서)
// ranking.js에 추가하면 좋습니다!

// NAC로고 클릭시 이동 딜레이
document.querySelectorAll('.logo-link').forEach(function(logo) {
    logo.addEventListener('click', function(e) {
        const targetUrl = this.dataset.url;
        setTimeout(() => {
            window.open(targetUrl, '_blank');
        }, 300);
    });
});