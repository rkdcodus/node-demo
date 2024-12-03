const express = require("express");
const conn = require("../mariadb");

const router = express.Router();

const SQL = {
  select: "SELECT * FROM users WHERE email = ?",
  insert: "INSERT INTO users (email, name, password, connect) VALUES(?,?,?,?)",
  delete: "DELETE FROM users WHERE email = ?",
};

router.use(express.json());

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) return res.status(400).json({ message: "이메일를 입력해주세요." });
  if (!password) return res.status(400).json({ message: "비밀번호를 입력해주세요." });

  conn.query(SQL.select, email, (_, result) => {
    const user = result[0];

    if (user && password === result[0].password) {
      res.status(200).json({ message: `${result[0].name}님 로그인 되었습니다.` });
    } else {
      res.status(404).json({ message: "이메일 또는 비밀번호를 잘못 입력했습니다." });
    }
  });
});

router.post("/join", (req, res) => {
  const { email, name, password, connect } = req.body;

  if (email && name && password) {
    conn.query(SQL.insert, [email, name, password, connect], (err) => {
      if (err) {
        res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
      } else {
        res.status(201).send({ message: `${name}님 회원가입 되었습니다.` });
      }
    });
  } else {
    res.status(400).json({ message: "잘못된 요청입니다." });
  }
});

router
  .route("/users")
  .get((req, res) => {
    const { email } = req.body;

    conn.query(SQL.select, email, (_, result) => {
      if (result.length) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
      }
    });
  })
  .delete((req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "이메일을 입력해주세요" });

    conn.query(SQL.select, email, (_, result) => {
      if (!result.length) {
        conn.query(SQL.delete, email, () => {
          res.status(200).json({ message: `정상적으로 회원 탈퇴되었습니다.` });
        });
      } else {
        res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
      }
    });
  });

module.exports = router;
