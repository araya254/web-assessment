const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // เปลี่ยนตาม User ของคุณ
    password: '',      // เปลี่ยนตาม Password ของคุณ
    database: 'webbbbb'
});
module.exports = db.promise();