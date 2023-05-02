const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/User.route");
const { postRouter } = require("./routes/Post.route");
const { auth } = require("./middlewares/auth.middleware");
require("dotenv").config();
//middlewares
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

//protected routes
app.use(auth)
app.use("/posts", postRouter);

//Server Home Page
app.get("/", (req, res) => {
  res.status(200).send({ msg: "Home Page" });
});

//server setup
app.listen(process.env.port || 3000, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    console.log("Something went wrong while connecting with db");
  }
  console.log(`Server running at port ${process.env.port}`);
});
