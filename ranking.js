// 구글 시트 연동 설정 - CSV 방식
const SHEET_ID = '1W83HVrHf2qrXdh8RvNg8Hr7CerxjRNDGSJ0qFsP0Bp8';
const SHEET_GID = '585669029'; // Leaderboards-Basic 시트의 GID로 변경하세요!

// CSV 형식으로 데이터 가져오기
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

// 페이지 로드 시 순위 데이터 불러오기
document.addEventListener('DOMContentLoaded', function() {
    loadRankingData();
    
    // 새로고침 버튼 이벤트
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadRankingData);
    }
});

// 순위 데이터 불러오기 함수
async function loadRankingData() {
    const rankingBody = document.getElementById('rankingBody');
    const lastUpdate = document.getElementById('lastUpdate');
    
    // 로딩 표시
    rankingBody.innerHTML = '<tr><td colspan="8" class="loading">순위 데이터를 불러오는 중... 🎵</td></tr>';
    
    try {
        // 프록시 서버를 통해 CORS 문제 해결
        const proxyUrl = 'https://corsproxy.io/?';
        const response = await fetch(proxyUrl + encodeURIComponent(CSV_URL));
        const csvText = await response.text();
        
        console.log('받은 CSV 데이터:', csvText); // 디버깅용
        
        // CSV 파싱
        const rows = csvText.trim().split('\n');
        if (rows.length > 1) {
            // 헤더 확인
            console.log('헤더:', rows[0]);
            
            // 헤더 제외하고 데이터 파싱
            const rankings = [];
            
            for (let i = 1; i < rows.length; i++) {
                const columns = parseCSVLine(rows[i]);
                console.log(`행 ${i}:`, columns); // 디버깅용
                
                // User Name(B열)이 있는 행만 처리
                if (columns.length >= 8 && columns[1] && columns[1].trim() !== '') {
                    const song1 = parseInt(columns[2]) || 0;
                    const song2 = parseInt(columns[3]) || 0;
                    const song3 = parseInt(columns[4]) || 0;
                    const song4 = parseInt(columns[5]) || 0;
                    
                    rankings.push({
                        rank: parseInt(columns[0]) || 0,
                        userName: columns[1].trim(),
                        song1: song1,
                        song2: song2,
                        song3: song3,
                        song4: song4,
                        total: parseInt(columns[6]) || (song1 + song2 + song3 + song4),
                        updateTime: columns[7] || ''
                    });
                }
            }
            
            // 총점 높은 순으로 정렬, 동점일 경우 업데이트 시간 빠른 순
            rankings.sort((a, b) => {
                if (b.total !== a.total) {
                    return b.total - a.total;
                }
                // 업데이트 시간 비교
                return new Date(a.updateTime) - new Date(b.updateTime);
            });
            
            // 순위표 HTML 생성
            displayRankings(rankings);
            
            // 업데이트 시간 표시
            const now = new Date();
            lastUpdate.textContent = now.toLocaleString('ko-KR');
            
        } else {
            rankingBody.innerHTML = '<tr><td colspan="8" class="loading">아직 등록된 참가자가 없습니다.</td></tr>';
        }
        
    } catch (error) {
        console.error('순위 데이터 로드 실패:', error);
        
        // 더 자세한 에러 정보 표시
        rankingBody.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    데이터를 불러오는데 실패했습니다. 😢<br>
                    <small>에러: ${error.message}</small><br>
                    <small>구글 시트의 공유 설정을 확인해주세요!</small>
                </td>
            </tr>
        `;
    }
}

// CSV 라인 파싱 함수 (쉼표 처리)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// 순위표 화면에 표시하는 함수
function displayRankings(rankings) {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = '';
    
    rankings.forEach((player, index) => {
        const displayRank = index + 1; // 실제 표시 순위
        const row = document.createElement('tr');
        
        // 16위까지 본선 진출 표시
        if (displayRank <= 16) {
            row.classList.add('qualified');
        }
        
        // 순위별 메달 아이콘
        let rankDisplay = displayRank;
        if (displayRank === 1) rankDisplay = '🥇 1';
        else if (displayRank === 2) rankDisplay = '🥈 2';
        else if (displayRank === 3) rankDisplay = '🥉 3';
        
        // 각 곡의 점수가 높으면 하이라이트
        const song1Class = player.song1 >= 99000 ? 'high-score' : '';
        const song2Class = player.song2 >= 99000 ? 'high-score' : '';
        const song3Class = player.song3 >= 99000 ? 'high-score' : '';
        const song4Class = player.song4 >= 99000 ? 'high-score' : '';
        
        // 곡별 점수 표시 (0점이면 '-' 표시)
        const song1Display = player.song1 > 0 ? player.song1.toLocaleString() : '-';
        const song2Display = player.song2 > 0 ? player.song2.toLocaleString() : '-';
        const song3Display = player.song3 > 0 ? player.song3.toLocaleString() : '-';
        const song4Display = player.song4 > 0 ? player.song4.toLocaleString() : '-';
        
        row.innerHTML = `
            <td class="rank-cell">${rankDisplay}</td>
            <td class="player-name">${player.userName}</td>
            <td class="${song1Class}">${song1Display}</td>
            <td class="${song2Class}">${song2Display}</td>
            <td class="${song3Class}">${song3Display}</td>
            <td class="${song4Class}">${song4Display}</td>
            <td class="total-score">${player.total.toLocaleString()}</td>
            <td class="update-time">${formatDateTime(player.updateTime)}</td>
        `;
        
        rankingBody.appendChild(row);
    });
    
    // 애니메이션을 위한 약간의 딜레이
    const rows = rankingBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
            row.style.transition = 'all 0.5s ease';
        }, index * 50);
    });
}

// 날짜 시간 포맷 함수
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr || dateTimeStr.trim() === '') return '-';
    
    try {
        // 다양한 날짜 형식 처리
        const date = new Date(dateTimeStr);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            
            // 시간이 00:00이면 날짜만 표시
            if (hours === 0 && minutes === 0) {
                return `${month}월 ${day}일`;
            }
            
            return `${month}월 ${day}일 ${hours}:${minutes.toString().padStart(2, '0')}`;
        }
        
        return dateTimeStr;
    } catch (error) {
        return dateTimeStr; // 파싱 실패시 원본 반환
    }
}

// 5분마다 자동 새로고침
setInterval(loadRankingData, 5 * 60 * 1000);

// 콘솔 이스터에그
console.log('%c🎼 NAC Op.3 - 4곡 총점 순위표 시스템 활성화! 🎼', 
    'color: #8B4513; font-size: 16px; font-weight: bold;');