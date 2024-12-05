const jwt = require("jsonwebtoken");
const token = jwt.sign({ foo: "bar" }, "shhh");
console.log(token);

// 검증
const decoded = jwt.verify(token, "shhh");

console.log(decoded);
