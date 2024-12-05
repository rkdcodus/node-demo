const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config();
app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const channelRouter = require("./routes/channels");

app.use("/", userRouter);
app.use("/channels", channelRouter);
