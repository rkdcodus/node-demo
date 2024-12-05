const express = require("express");
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();

const SQL = {
  select: "SELECT * FROM users WHERE email = ?",
  insert: "INSERT INTO users (email, name, password, connect) VALUES(?,?,?,?)",
  delete: "DELETE FROM users WHERE email = ?",
};

// 미들웨어
function validator(req, res, next) {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  res.status(400).json(err.array());
}

router.use(express.json());

router.post(
  "/signin",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 필요"),
    validator,
  ],
  (req, res) => {
    const { email, password } = req.body;

    conn.query(SQL.select, email, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      const user = result[0];

      if (user && password === result[0].password) {
        return res.status(200).json({ message: `${result[0].name}님 로그인 되었습니다.` });
      }
      res.status(404).json({ message: "이메일 또는 비밀번호를 잘못 입력했습니다." });
    });
  }
);

router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 필요"),
    body("name").notEmpty().isString().withMessage("이름 입력 필요"),
    body("connect").isMobilePhone().withMessage("연락처 입력 필요"),
    validator,
  ],
  (req, res) => {
    const { email, name, password, connect } = req.body;

    conn.query(SQL.insert, [email, name, password, connect], (err) => {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      res.status(201).send({ message: `${name}님 회원가입 되었습니다.` });
    });
  }
);

router
  .route("/users")
  .get(
    [body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"), validator],
    (req, res) => {
      const { email } = req.body;

      conn.query(SQL.select, email, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (result.length) {
          return res.status(200).json(result);
        }
        res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
      });
    }
  )
  .delete(
    [body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"), validator],
    (req, res) => {
      const { email } = req.body;

      conn.query(SQL.select, email, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (!result.length) {
          return conn.query(SQL.delete, email, () => {
            res.status(200).json({ message: `정상적으로 회원 탈퇴되었습니다.` });
          });
        }
        res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
      });
    }
  );

module.exports = router;
