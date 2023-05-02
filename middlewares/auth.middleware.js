const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.secretKey, (error, decoded) => {
      if (decoded) {
        req.body.authorID = decoded.data.authorID;
        req.body.author = decoded.data.author;
        // res.send("token verified");
        next();
      } else {
        res.status(400).send({ err: error });
      }
    });
  } else {
    res.status(200).send({ msg: "Please Login to Access Your Posts" });
  }
};
module.exports = { auth };
