const express = require("express");
const app = express();

app.listen(8888);

// path parameter
app.get("/products/:id", (req, res) => {
  // const id = parseInt(req.params.id);
  const id = +req.params.id;
  res.json({
    id,
  });
});

// 쿼리스트링으로 파라미터 받기 : //localhost:8888/watch?v=LlhTafcDCuU&t=291s
// 정보 검색, 정렬, 필터링
app.get("/watch", (req, res) => {
  const { v, t } = req.q;

  res.json({
    video: v,
    timeline: t,
  });
});
