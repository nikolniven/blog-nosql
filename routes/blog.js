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
    .sort({ date: -1 })
    .toArray();
  res.render("posts-list", { posts: posts });
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
  // Insert the new post into the database
  const result = await dba.getDb().collection("posts").insertOne(newPost);
  console.log(result); // Optional: log the result to the console for debugging

  // Redirect to the posts page after adding the post
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res) {
  const postId = req.params.id; // Extract the post ID from the URL
  try {
    const objectId = new ObjectId(postId); // Convert the ID to an ObjectId
    const post = await dba
      .getDb()
      .collection("posts")
      .findOne({ _id: objectId }); // Fetch the post by ID

    if (!post) {
      return res.status(404).render("404"); // If no post found, render the 404 page
    }

    // Add human-readable date to the post object
    post.humanReadableDate = post.date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    post.date = post.date.toISOString(); // Convert date to ISO format

    res.render("post-detail", { post: post }); // Render the post-detail.ejs template with the post data
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).render("500"); // Render the 500 error page if an unexpected error occurs
  }
});

router.get("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const objectId = new ObjectId(postId);

  const post = await dba.getDb().collection("posts").findOne({ _id: objectId });

  if (!post) {
    return res.status(404).render("404");
  }

  // Render the edit form with the post data
  res.render("update-post", { post: post });
});

router.post("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const objectId = new ObjectId(postId);

  const updatedPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
  };

  const result = await dba
    .getDb()
    .collection("posts")
    .updateOne({ _id: objectId }, { $set: updatedPost });

  if (result.modifiedCount === 0) {
    return res.status(404).render("404");
  }

  res.redirect("/posts/" + postId);
});

router.post("/posts/:id/delete", async function (req, res) {
  const postId = req.params.id;
  const objectId = new ObjectId(postId);

  const result = await dba
    .getDb()
    .collection("posts")
    .deleteOne({ _id: objectId });

  res.redirect("/posts");
});

module.exports = router;
