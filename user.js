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
    let isUser = false;
    // const user = [...usersDB].find((user) => user[1].userId == userId);
    usersDB.forEach((user) => {
      if (user.userId === userId && user.password === password) {
        res.status(200).json({ message: `${user.name}님 로그인에 성공했습니다.` });
        isUser = true;
      } else if (user.userId === userId) {
        res.status(403).json({ message: "비밀번호를 잘못 입력했습니다." });
        isUser = true;
      }
    });

    if (!isUser) res.status(403).json({ message: "등록되지 않은 아이디입니다." });
  } else if (userId === "") {
    res.status(400).json({ message: "아이디를 입력해주세요" });
  } else if (password === "") {
    res.status(400).json({ message: "비밀번호를 입력해주세요" });
  }
});

// 회원가입
app.post("/join", (req, res) => {
  const { userId, name, password } = req.body;

  if (userId && name && password) {
    usersDB.forEach((user) => {
      if (user.userId === userId) {
        return res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
      }
    });

    let newId = 1;
    if (usersDB.size > 0) newId = [...usersDB.keys()].pop() + 1;

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
