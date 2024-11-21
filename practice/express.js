const express = require("express");
const app = express();

app.listen(8888);

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.get("/test/1", (req, res) => {
  res.json({
    title: "Node.js를 공부하자!",
    price: 20000,
    description: "Node.js를 배울 수 있는 책",
  });
});

app.get("/test/2", (req, res) => {
  res.send("One!!");
  console.log("?");
});

app.get("/test/3", (req, res) => {
  res.json({
    say: "안녕하세요!",
  });
});
