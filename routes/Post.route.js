const express = require("express");
const { validator } = require("../middlewares/validator.middleware");
const { PostModel } = require("../models/Post.model");

const postRouter = express.Router();

//get post
postRouter.get("/", async (req, res) => {
  // console.log(req.body);
  let { device  } = req.query;
//   console.log(device, device1, device2, device3);
  let { authorID } = req.body;
  if (authorID) {
    let obj = {};
    obj.authorID = authorID;
    device ? (obj.device = device) : null;
    // console.log(obj);
    try {
      let posts = await PostModel.find(obj);
      res.status(200).send({ msg: posts });
    } catch (error) {
      res.status(400).send({ err: error });
    }
  } else {
    res.status(200).send({ msg: "Please Login to access your posts" });
  }
});

//create post
postRouter.post("/create", validator, async (req, res) => {
  // console.log(req.body)
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).send({ msg: "Post created Successfully" });
  } catch (error) {
    res.status(400).send({ err: error });
  }
});

//edit post
postRouter.patch("/update/:postID", async (req, res) => {
  const { postID } = req.params;
  const post = await PostModel.findOne({ _id: postID });
  const data = req.body;
  try {
    if (data.authorID === post.authorID) {
      await PostModel.findByIdAndUpdate({ _id: postID }, data);
      res
        .status(200)
        .send({ msg: `Post with id ${postID} has been Updated Successfully` });
    } else {
      res.status(200).send({ msg: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).send({ err: error });
  }
});

//delete post
postRouter.delete("/delete/:postID", async (req, res) => {
  const { postID } = req.params;
  const post = await PostModel.findOne({ _id: postID });
  const data = req.body;
  try {
    if (data.authorID === post.authorID) {
      await PostModel.findByIdAndDelete({ _id: postID });
      res
        .status(200)
        .send({ msg: `Post with id ${postID} has been Deleted Successfully` });
    } else {
      res.status(200).send({ msg: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).send({ err: error });
  }
});
module.exports = { postRouter };
