app.post("/evaluate", auth, (req, res) => {

  const {
    group_id,
    evaluated_id,
    responsibility,
    teamwork,
    punctuality,
    comment
  } = req.body;

  // ❌ ห้ามประเมินตัวเอง
  if (req.user.id == evaluated_id) {
    return res.status(400).json({
      message: "ไม่สามารถประเมินตัวเองได้"
    });
  }

  db.query(
    `INSERT INTO evaluations
     (group_id,evaluator_id,evaluated_id,responsibility,teamwork,punctuality,comment)
     VALUES (?,?,?,?,?,?,?)`,
    [
      group_id,
      req.user.id,
      evaluated_id,
      responsibility,
      teamwork,
      punctuality,
      comment
    ],
    (err) => {

      // ❌ ถ้าซ้ำจะ error จาก UNIQUE
      if (err) {
        return res.status(400).json({
          message: "คุณได้ประเมินคนนี้ไปแล้ว"
        });
      }

      res.json({ message: "บันทึกสำเร็จ" });
    }
  );
});
