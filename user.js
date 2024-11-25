const express = require("express");
const app = express();
const port = 8888;

app.listen(port, () => {
  console.log(`✨ app listening on port ${port} ✨`);
});

const usersDB = new Map();

// 로그인
app.use(express.json());
app.post("/signin", (req, res) => {
  const { userId, password } = req.body;

  if (userId && password) {
    const user = [...usersDB].find(
      (user) => user[1].userId == userId && user[1].password == password
    );

    if (user) {
      res.status(200).json({ message: `${user[1].name}님 로그인에 성공했습니다.` });
    } else {
      res.status(403).json({ message: "없는 회원입니다." });
    }
  } else {
    res.status(400).json({ message: "잘못된 요청입니다." });
  }
});

// 회원가입
app.post("/join", (req, res) => {
  const { userId, name, password } = req.body;

  if (userId && name && password) {
    let newId = 1;
    if (usersDB.size > 0) {
      newId = [...usersDB.keys()].pop() + 1;
    }

    usersDB.set(newId, { userId, name, password });
    res.status(201).send(`${name}님 환영합니다.`);
  } else {
    res.status(400).json({ message: "잘못된 요청입니다." });
  }
});

// 동일한 path 요청은 route로 합치기
app
  .route("/users/:id")
  .get((req, res) => {
    // 회원 개별 조회
    const id = +req.params.id;

    if (usersDB.has(id)) {
      const { userId, name } = usersDB.get(id);
      res.status(200).json({ userId, name });
    } else {
      res.status(404).json({ message: "요청하신 id 값과 일치하는 데이터가 없습니다." });
    }
  })
  .delete((req, res) => {
    // 회원 개별 탈퇴
    const id = +req.params.id;

    if (usersDB.has(id)) {
      const name = usersDB.get(id).name;
      usersDB.delete(id);
      res.status(200).json({ message: `${name}님 정상적으로 회원 탈퇴되었습니다.` });
    } else {
      res.status(400).json({ message: `입력하신 id값과 일치하는 회원 정보가 없습니다.` });
    }
  });
