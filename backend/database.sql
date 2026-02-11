CREATE DATABASE peer_evaluation;
USE peer_evaluation;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(100),
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT,
  user_id INT
);

CREATE TABLE evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT,
  evaluator_id INT,
  evaluated_id INT,
  responsibility INT,
  teamwork INT,
  punctuality INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 