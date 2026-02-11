const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/members', async (req, res) => {
    try {
        // ดึงรายชื่อทุกคนยกเว้นตัวเอง (ในที่นี้ดึงมาก่อนทั้งหมดเพื่อความง่าย)
        const [rows] = await db.execute('SELECT student_id, fullname, email, avatar_url FROM users');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;