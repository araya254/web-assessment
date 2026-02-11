const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'peer_evaluation'
});

db.connect();

db.query(`
  ALTER TABLE users 
  ADD role ENUM('student','admin') DEFAULT 'student'
`);

db.query(`
  ALTER TABLE evaluations
  ADD CONSTRAINT unique_eval
  UNIQUE (group_id, evaluator_id, evaluated_id)
`);

console.log("Database updated");
db.end();
