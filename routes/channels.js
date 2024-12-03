const express = require("express");
const router = express.Router();

const conn = require("../mariadb");

router.use(express.json());

router
  .route("/")
  .post((req, res) => {
    const { name, userId } = req.body;

    if (name && userId) {
      conn.query(
        "INSERT INTO channels (name, user_id) VALUES(?,?)",
        [name, userId],
        function (err) {
          if (err) {
            res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
          } else {
            res.status(201).json({ message: `${name} 채널이 생성되었습니다.` });
          }
        }
      );
    } else {
      res.status(400).json({ message: "잘못된 요청입니다." });
    }
  })
  .get((req, res) => {
    const { userId } = req.body;

    if (userId) {
      conn.query("SELECT * FROM channels WHERE user_id = ?", userId, function (err, result) {
        if (result.length) {
          res.status(200).json(result);
        } else {
          notFoundChannel(res);
        }
      });
    } else {
      notFoundChannel(res);
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    const id = +req.params.id;

    conn.query("SELECT * FROM channels WHERE id = ?", id, function (err, result) {
      if (result.length) {
        res.status(200).json(result);
      } else {
        notFoundChannel(res);
      }
    });
  })
  .put((req, res) => {
    const id = +req.params.id;
    const newName = req.body.name;

    if (!newName) return res.status(400).json({ message: "채널명을 입력해주세요" });

    conn.query("SELECT * FROM channels WHERE id = ?", id, function (err, result) {
      if (result.length) {
        const prevName = result[0].name;

        if (prevName === newName) {
          return res.status(409).json({ message: "이전 채널명과 동일합니다." });
        }

        conn.query("UPDATE channels SET name = ? WHERE id = ?", [newName, id], function () {
          res.status(200).json({
            message: `채널명이 ${prevName}에서 ${newName}(으)로 변경되었습니다.`,
          });
        });
      } else {
        notFoundChannel(res);
      }
    });
  })
  .delete((req, res) => {
    const id = +req.params.id;

    conn.query("DELETE FROM channels WHERE id = ?", id, function (err, result) {
      res.status(200).json({ message: `채널이 삭제되었습니다.` });

      // res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
    });
  });

function notFoundChannel(res) {
  return res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
}

module.exports = router;
