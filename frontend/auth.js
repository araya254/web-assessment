async function handleRegister(event) {
    event.preventDefault(); // ป้องกันหน้าเว็บรีโหลด

    const fullname = document.getElementById('reg_fullname').value;
    const student_id = document.getElementById('reg_student_id').value;
    const email = document.getElementById('reg_email').value;
    const password = document.getElementById('reg_password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: student_id,
                fullname: fullname,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('🎉 สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            window.location.href = 'login.html';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
}