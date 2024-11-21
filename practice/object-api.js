const express = require("express");
const app = express();

app.listen(8888);

let youtuber1 = {
  chennelName: "십오야",
  subscriber: "593만명",
  videoNum: "993개",
};

let youtuber2 = {
  chennelName: "침착맨",
  subscriber: "227만명",
  videoNum: "6.6천개",
};

let youtuber3 = {
  chennelName: "테오",
  subscriber: "54.8만명",
  videoNum: "726천개",
};

app.get("/:nickname", (req, res) => {
  const { nickname } = req.params;

  if (nickname == "@15ya") res.json(youtuber1);
  else if (nickname == "@침착맨") res.json(youtuber2);
  else if (nickname == "@teo") res.json(youtuber3);
  else
    res.json({
      message: "없는 유튜버입니다.",
    });
});
