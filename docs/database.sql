-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS webbbbb_db;
USE webbbbb_db;

-- ตารางผู้ใช้งาน
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางรายการข้อมูล (ตัวอย่างข้อมูลในระบบ)
CREATE TABLE records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO users (name, email, password, role) VALUES
('Araya', 'araya@email.com', '123456', 'admin'),
('Smart', 'smart@email.com', '123456', 'user');

INSERT INTO records (title, description, user_id) VALUES
('Test Record 1', 'This is sample data 1', 1),
('Test Record 2', 'This is sample data 2', 2);
