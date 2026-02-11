let currentRatings = { enthusiasm: 0, participation: 0, punctuality: 0, collaboration: 0, problem_solving: 0 };
let targetStudentId = '';

// ฟังก์ชันระบายสีดาว
document.querySelectorAll('.stars span').forEach((star, index) => {
    star.onclick = (e) => {
        const parent = e.target.parentElement;
        const category = parent.parentElement.dataset.id;
        const stars = parent.querySelectorAll('span');
        
        currentRatings[category] = index + 1;
        stars.forEach((s, i) => s.classList.toggle('active', i <= index));
    };
});

async function loadDashboard() {
    const res = await fetch('http://localhost:3000/api/summary/1'); // สมมติ user id = 1
    const data = await res.json();
    
    document.getElementById('countText').innerText = `${data.completedCount}/${data.totalMembers}`;
    document.getElementById('avgText').innerText = `${data.averageScore}/5`;
    document.getElementById('progressText').innerText = `${data.progress}%`;
}

async function submitEvaluation() {
    const payload = {
        reviewer_id: 1,
        reviewee_id: targetStudentId,
        ratings: currentRatings,
        comment: document.getElementById('commentArea').value
    };

    const res = await fetch('http://localhost:3000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    if(res.ok) {
        alert('ส่งการประเมินเรียบร้อย');
        location.reload();
    }
}