const express = require("express");

const dba = require("../data/database");

const mongodb = require("mongodb");

const router = express.Router();

const ObjectId = mongodb.ObjectId;

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", function (req, res) {
  res.render("posts-list");
});

router.get("/new-post", async function (req, res) {
  const authors = await dba.getDb().collection("authors").find().toArray();
  console.log(authors);
  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await dba
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId });
  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      authorId: authorId,
      name: author.name,
      email: author.email,
    },
  };

  const result = await dba.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.redirect("/posts");
});

module.exports = router;
