const express = require("express");
const app = express();
const port = 8888;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());

app.post("/test", (req, res) => {
  console.log(req.body.message);
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
