const express = require("express");
const app = express();

app.listen(8888);

let db = new Map();

let notebook = {
  productName: "Notebook",
  price: 200000,
};

let poster = {
  productName: "Poster",
  price: 10000,
};

let cup = {
  productName: "Cup",
  price: 3000,
};

db.set(1, notebook);
db.set(2, poster);
db.set(3, cup);

app.get("/:id", (req, res) => {
  let { id } = req.params;

  id = parseInt(id);

  if (db.has(id)) {
    const product = { id, ...db.get(id) };
    res.json(product);
  } else {
    res.json({ message: "db에 없음." });
  }
});

res.json({
  id,
  productName: db.get(id).productName,
  price: db.get(id).price,
});
