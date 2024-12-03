const express = require("express");
const router = express.Router();

const conn = require("../mariadb");

router.use(express.json());

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) return res.status(400).json({ message: "이메일를 입력해주세요." });
  if (!password) return res.status(400).json({ message: "비밀번호를 입력해주세요." });

  conn.query("SELECT * FROM users WHERE email = ?", email, function (err, result) {
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
    conn.query(
      "INSERT INTO users (email, name, password, connect) VALUES(?,?,?,?)",
      [email, name, password, connect],
      function (err) {
        if (err) {
          res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
        } else {
          res.status(201).send({ message: `${name}님 회원가입 되었습니다.` });
        }
      }
    );
  } else {
    res.status(400).json({ message: "잘못된 요청입니다." });
  }
});

router
  .route("/users")
  .get((req, res) => {
    const { email } = req.body;

    conn.query("SELECT * FROM users WHERE email = ?", email, function (err, result) {
      if (result.length) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
      }
    });
  })
  .delete((req, res) => {
    const { email } = req.body;

    if (email) {
      conn.query("DELETE FROM users WHERE email = ?", email, function (err, result) {
        res.status(200).json({ message: `정상적으로 회원 탈퇴되었습니다.` });

        // res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
      });
    } else {
      res.status(400).json({ message: "이메일을 입력해주세요" });
    }
  });

module.exports = router;
