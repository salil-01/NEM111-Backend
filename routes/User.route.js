const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../models/User.model");
const userRouter = express.Router();

//create a new user
userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  //   console.log(name, email, gender, password);
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (hash) {
        const user = new UserModel({ name, email, gender, password: hash });
        await user.save();
        res.status(200).send({ msg: "New User Registered Successfully" });
      } else {
        res.status(200).send({ err: err });
      }
    });
  } catch (error) {
    res.status(400).send({ err: error });
  }
});

//login exisiting user
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      //comparing password on login
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          //creating jwt token and send it with response if login successfull
          const token = jwt.sign(
            {
              data: {
                authorID: user._id,
                author: user.name,
              },
            },
            process.env.secretKey
          );
          res.status(200).send({ msg: "Login Successfull", token });
        } else {
          res.status(200).send({ err: err, msg: "Invalid Credentials" });
        }
      });
    } else {
      res.status(200).send({ msg: "User does not exist" });
    }
  } catch (error) {
    res.status(400).send({ err: error });
  }
});
module.exports = { userRouter };
