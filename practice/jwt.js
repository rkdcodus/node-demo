const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const token = jwt.sign({ foo: "bar" }, process.env.PRIVATE_KEY);
console.log(token);

// 검증
const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

console.log(decoded);
