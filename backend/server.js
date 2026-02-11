const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const auth = require("./middleware/auth");
const adminOnly = require("./middleware/admin");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "peer_evaluation"
});

const SECRET = "mysecretkey";

/* REGISTER */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hash],
    err => {
      if (err) return res.status(400).json({ message: "อีเมลซ้ำ" });
      res.json({ message: "สมัครสำเร็จ" });
    }
  );
});

/* LOGIN */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
    if (results.length === 0)
      return res.status(400).json({ message: "ไม่พบผู้ใช้" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "รหัสผ่านผิด" });

    const token = jwt.sign(
      { id: user.id, name: user.name },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, name: user.name });
  });
});

/* CREATE GROUP */
app.post("/groups", auth, (req, res) => {
  db.query(
    "INSERT INTO groups (group_name,owner_id) VALUES (?,?)",
    [req.body.group_name, req.user.id],
    (err, result) => {
      db.query(
        "INSERT INTO group_members (group_id,user_id) VALUES (?,?)",
        [result.insertId, req.user.id]
      );
      res.json({ message: "สร้างกลุ่มสำเร็จ" });
    }
  );
});

/* GET MY GROUPS */
app.get("/my-groups", auth, (req, res) => {
  db.query(
    `SELECT groups.* FROM groups
     JOIN group_members ON groups.id = group_members.group_id
     WHERE group_members.user_id=?`,
    [req.user.id],
    (err, results) => res.json(results)
  );
});

/* SUMMARY */
app.get("/summary/:group_id", auth, (req, res) => {
  db.query(
    `SELECT users.name,
    ROUND(AVG((responsibility+teamwork+punctuality)/3),2) avg_score
     FROM evaluations
     JOIN users ON evaluations.evaluated_id = users.id
     WHERE group_id=?
     GROUP BY evaluated_id`,
    [req.params.group_id],
    (err, results) => res.json(results)
  );
});

/* EXPORT PDF */
app.get("/export/:group_id", auth, (req, res) => {
  db.query(
    `SELECT users.name,
    ROUND(AVG((responsibility+teamwork+punctuality)/3),2) avg_score
     FROM evaluations
     JOIN users ON evaluations.evaluated_id = users.id
     WHERE group_id=?
     GROUP BY evaluated_id`,
    [req.params.group_id],
    (err, results) => {

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      doc.fontSize(18).text("Peer Evaluation Summary");
      doc.moveDown();

      results.forEach(r => {
        doc.text(`${r.name} : ${r.avg_score}`);
      });

      doc.end();
    }
  );
});

app.listen(3000, () =>
  console.log("Server running http://localhost:3000")
);

/* ================= ADMIN ================= */

/* ดูทุกกลุ่ม */
app.get("/admin/groups", auth, adminOnly, (req, res) => {
  db.query("SELECT * FROM groups", (err, results) => {
    res.json(results);
  });
});

/* ดูคะแนนทุกกลุ่ม */
app.get("/admin/group/:id/summary", auth, adminOnly, (req, res) => {
  db.query(
    `SELECT users.name,
     ROUND(AVG((responsibility+teamwork+punctuality)/3),2) avg_score
     FROM evaluations
     JOIN users ON evaluations.evaluated_id = users.id
     WHERE group_id=?
     GROUP BY evaluated_id`,
    [req.params.id],
    (err, results) => res.json(results)
  );
});
