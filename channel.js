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
  .get((req, res) => {
    const id = +req.params.id;

    if (channelsDB.has(id)) res.status(200).json(channelsDB.get(id));
    else res.status(404).json({ message: "요청하신 id와 일치하는 채널이 없습니다." });
  })
  .put((req, res) => {
    const id = +req.params.id;
    const newChannelTitle = req.body.channelTitle;

    if (!channelsDB.has(id)) {
      return res.status(404).json({ message: "요청하신 id와 일치하는 채널이 없습니다." });
    }

    if (!newChannelTitle) return res.status(400).json({ message: "채널명을 입력해주세요" });

    const channelTitle = channelsDB.get(id).channelTitle;

    if (channelTitle === newChannelTitle) {
      return res.status(409).json({ message: "이전 채널명과 동일합니다." });
    }

    channelsDB.set(id, { newChannelTitle });
    res
      .status(200)
      .send(`채널명이 "${channelTitle}"에서 "${newChannelTitle}"(으)로 변경되었습니다.`);
  })
  .delete((req, res) => {});
