const express = require("express");
const router = express.Router();

const channelsDB = new Map();

router.use(express.json());

router
  .route("/")
  .post((req, res) => {
    const { userId, channelTitle } = req.body;

    if (userId && channelTitle) {
      // userId가 회원 DB에 존재해야함.
      let newId = 1;
      if (channelsDB.size > 0) newId = [...channelsDB.keys()].pop() + 1;

      channelsDB.set(newId, { userId, channelTitle });

      res.status(201).json({ message: `${channelTitle} 채널이 생성되었습니다.` });
    } else {
      res.status(400).json({ message: "채널명과 아이디를 모두 입력해주세요" });
    }
  })
  .get((req, res) => {
    const { userId } = req.body;
    if (channelsDB.size > 0 && userId) {
      let channels = [...channelsDB]
        .map(([key, value]) => value)
        .filter((channel) => channel.userId === userId);

      if (!channels.length) notFoundChannel();

      res.status(200).json(channels);
    } else notFoundChannel();
  });

router
  .route("/:id")
  .get((req, res) => {
    const id = +req.params.id;

    if (channelsDB.has(id)) res.status(200).json(channelsDB.get(id));
    else notFoundChannel(res);
  })
  .put((req, res) => {
    const id = +req.params.id;
    const newChannelTitle = req.body.channelTitle;

    if (!channelsDB.has(id)) notFoundChannel();

    if (!newChannelTitle) return res.status(400).json({ message: "채널명을 입력해주세요" });

    const channelTitle = channelsDB.get(id).channelTitle;

    if (channelTitle === newChannelTitle) {
      return res.status(409).json({ message: "이전 채널명과 동일합니다." });
    }

    channelsDB.set(id, { channelTitle: newChannelTitle });

    res.status(200).json({
      message: `채널명이 ${channelTitle}에서 ${newChannelTitle}(으)로 변경되었습니다.`,
    });
  })
  .delete((req, res) => {
    const id = +req.params.id;

    if (channelsDB.has(id)) {
      const channelTitle = channelsDB.get(id).channelTitle;

      channelsDB.delete(id);

      res.status(200).json({ message: `${channelTitle}채널이 삭제되었습니다.` });
    } else {
      notFoundChannel();
    }
  });

function notFoundChannel(res) {
  return res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
}

module.exports = router;
