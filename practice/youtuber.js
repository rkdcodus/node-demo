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
  if (db.size > 0) {
    const dbObject = Object.fromEntries(db); // Map 객체를 Object로 변환
    res.status(200).json(dbObject); // res.json()이 object를 JSON 문자열로 변환.
  } else {
    res.status(404).json({
      message: "등록된 유튜버가 없습니다.",
    });
  }
});

// 유튜버 개별 조회
app.get("/youtubers/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (!db.has(id)) {
    res.status(404).json({ message: "can not find youTubers data" });
  } else {
    const youtubers = { id, ...db.get(id) };
    res.status(200).json(youtubers);
  }
});

// express에서 제공하는 미들웨어: json()
// 클라이언트로부터 받은 요청(req.body)를 json형식으로 파싱해주는 역할을 한다.
// content-type이 application/json 형식이여야함.
app.use(express.json());

// 새로운 유튜버 데이터 등록
app.post("/youtubers", (req, res) => {
  const data = req.body.channelName;
  const newId = [...db.keys()].pop() + 1;

  if (!data) {
    res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  } else {
    db.set(newId, data);

    res.status(201).json({
      message: `${data}님 유튜버가 되신 것을 환영합니다, `,
    });
  }
});

// 개별 유튜버 삭제
app.delete("/youtubers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let message = "";
  let status = 200;

  if (!db.has(id)) {
    status = 404;
    message = `요청하신 ${id}번 유튜버는 없는 유튜버입니다.`;
  } else {
    const name = db.get(id).channelName;

    db.delete(id);

    message = `${name}님 정상 삭제되었습니다.`;
  }

  res.status(status).json({ message });
});

// 전체 유튜버 삭제
app.delete("/youtubers", (req, res) => {
  let message = "";
  let status = 200;

  if (db.size > 0) {
    db.clear();

    message = "유튜버 전체 데이터가 삭제되었습니다.";
  } else {
    status = 404;
    message = "삭제할 유튜버가 없습니다.";
  }

  res.status(status).json({ message });
});

// 개별 유튜버 수정
app.put("/youtubers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const channelName = req.body.channelName;
  let message = "";
  let status = 200;

  if (channelName == undefined) {
    status = 400;
    message = `올바르지 않은 요청 형식입니다.`;
  } else if (db.has(id)) {
    const prev = db.get(id);

    db.set(id, { ...prev, channelName });

    message = `${prev.channelName}님, 채널명이 ${channelName}(으)로 변경되었습니다.`;
  } else {
    status = 404;
    message = `요청하는 ${id}는 없는 유튜버입니다.`;
  }

  res.status(status).json({ message });
});
