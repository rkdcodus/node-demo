// express 모듈 세팅
const express = require("express");
const app = express();

app.listen(8888);

// db 세팅
let youtuber1 = {
  channelName: "십오야",
  subscriber: "593만명",
  videoNum: "993개",
};

let youtuber2 = {
  channelName: "침착맨",
  subscriber: "227만명",
  videoNum: "6.6천개",
};

let youtuber3 = {
  channelName: "테오",
  subscriber: "54.8만명",
  videoNum: "726천개",
};

const db = new Map();
db.set(1, youtuber1);
db.set(2, youtuber2);
db.set(3, youtuber3);

//REST API 설계
// 전체 유튜버 조회
app.get("/youtubers", (req, res) => {
  const dbObject = Object.fromEntries(db); // Map 객체를 Object로 변환
  res.json(dbObject); // res.json()이 object를 JSON 문자열로 변환.
});

// 유튜버 개별 조회
app.get("/youtubers/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  if (!db.has(id)) {
    res.json({ message: "can not find youTubers data" });
  } else {
    const youtubers = { id, ...db.get(id) };
    res.json(youtubers);
  }
});

// express에서 제공하는 미들웨어: json()
// 클라이언트로부터 받은 요청(req.body)를 json형식으로 파싱해주는 역할을 한다.
// content-type이 application/json 형식이여야함.
app.use(express.json());

// 새로운 유튜버 데이터 등록
app.post("/youtubers", (req, res) => {
  const data = req.body;
  db.set(db.size + 1, data);

  console.log(db);
  res.json({
    message: `${req.body.channelName}님 유튜버가 되신 것을 환영합니다`,
  });
});
