const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const conn = require("../mariadb");

router.use(express.json());

// 미들웨어
function validator(req, res, next) {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json(err.array());
  }

  next();
}

function notFoundChannel(res) {
  return res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
}

router
  .route("/")
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("숫자 입력 필요"),
      body("name").notEmpty().isString().withMessage("문자 입력 필요"),
      validator,
    ],
    (req, res) => {
      const { name, userId } = req.body;
      const sql = "INSERT INTO channels (name, user_id) VALUES(?,?)";
      const values = [name, userId];

      conn.query(sql, values, function (err) {
        if (err) {
          return res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
        }
        res.status(201).json({ message: `${name} 채널이 생성되었습니다.` });
      });
    }
  )
  .get([body("userId").notEmpty().isInt().withMessage("숫자 입력 필요"), validator], (req, res) => {
    const { userId } = req.body;
    const sql = "SELECT * FROM channels WHERE user_id = ?";

    conn.query(sql, userId, function (err, result) {
      if (result.length) {
        return res.status(200).json(result);
      }
      notFoundChannel(res);
    });
  });

router
  .route("/:id")
  .get([param("id").notEmpty().withMessage("채널 id 필요"), validator], (req, res) => {
    const id = +req.params.id;
    const sql = "SELECT * FROM channels WHERE id = ?";

    conn.query(sql, id, (err, result) => {
      if (result.length) {
        return res.status(200).json(result);
      }
      notFoundChannel(res);
    });
  })
  .put(
    [
      param("id").notEmpty().withMessage("채널 id 필요"),
      body("name").notEmpty().isString().withMessage("채널명 필요"),
      validator,
    ],
    (req, res) => {
      const id = +req.params.id;
      const newName = req.body.name;
      const sql = "UPDATE channels SET name = ? WHERE id = ?";
      const values = [newName, id];

      conn.query(sql, values, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (result.affectedRows == 0) {
          return res.status(400).end();
        }
        res.status(200).json({
          message: `채널명이 ${newName}(으)로 변경되었습니다.`,
        });
      });
    }
  )
  .delete([param("id").notEmpty().withMessage("채널 id 필요"), validator], (req, res) => {
    const id = +req.params.id;
    const sql = "DELETE FROM channels WHERE id = ?";

    conn.query(sql, id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      if (result.affectedRows == 0) {
        return res.status(400).end();
      }
      res.status(200).json({ message: `채널이 삭제되었습니다.` });
    });
  });

module.exports = router;
