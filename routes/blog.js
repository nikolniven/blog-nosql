const express = require("express");

const dba = require("../data/database");

const mongodb = require("mongodb");

const router = express.Router();

const ObjectId = mongodb.ObjectId;

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const posts = await dba
    .getDb()
    .collection("posts")
    .find({}, { title: 1, summary: 1, "author.name": 1 })
    .toArray();
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  const authors = await dba.getDb().collection("authors").find().toArray();
  console.log(authors);
  res.render("create-post", { authors: authors });
});

// router.get("/posts/:id", async function (req, res) {
//   const postId = req.params.id;
//   const objectId = new ObjectId(postId);

//   const singlePost = await dba
//     .getDb()
//     .collection("posts")
//     .findOne({ _id: objectId });

//   res.render("post-detail", { singlePost: singlePost });
// });

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

  router.get("/posts:id", async function (req, res) {
    const singlePost = newObject(req.body.post);
  });

  const result = await dba.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res) {
  const postId = req.params.id;
  const objectId = new ObjectId(postId);

  const post = await dba.getDb().collection("posts").findOne({ _id: objectId });

  if (!post) {
    return res.status(404).render("404");
  }

  res.render("post-detail", { post: post });
});

module.exports = router;
