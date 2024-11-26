const express = require("express");
const app = express();
const port = 8888;

app.listen(port, () => {
  console.log(`✨ app listening on port ${port} ✨`);
});

const channelsDB = new Map();

app.use(express.json());

app
  .route("/channels")
  .post((req, res) => {
    const { channelTitle } = req.body;

    if (channelTitle) {
      let newId = 1;
      if (channelsDB.size > 0) newId = [...channelsDB.keys()].pop() + 1;
      channelsDB.set(newId, { channelTitle });
      res.status(201).send(`"${channelTitle}" 채널이 생성되었습니다.`);
    } else {
      res.status(400).json({ message: "채널명을 입력해주세요" });
    }
  })
  .get((req, res) => {
    const channels = Object.fromEntries(channelsDB);
    if (channelsDB.size > 0) res.status(200).json(channels);
    else res.status(200).send("아직 생성된 채널이 없습니다.");
  });

app
  .route("/channels/:id")
  .get((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {});
