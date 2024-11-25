const express = require("express");
const app = express();

app.listen(8888);

const animals = [
  { id: 1, name: "bird" },
  { id: 2, name: "lion" },
  { id: 3, name: "dog" },
  { id: 4, name: "cat" },
];

// 동물 전체 조회
app.get("/animals", (req, res) => {
  res.json(animals); // json array
});

// 동물 개별 조회
app.get("/animals/:id", (req, res) => {
  const id = req.params.id;
  const animal = animals.find((animal) => animal.id == id);

  if (animal) res.json(animal);
  else res.status(404).send("id 값과 일치하는 데이터가 없습니다.");
});
