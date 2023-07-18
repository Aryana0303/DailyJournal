//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");





const homeStartingContent = "Within the pages of your journal, you have the power to unearth the gems of your inner world, explore the tapestry of your thoughts and emotions, and make sense of the intricacies of your existence. It is a canvas where you can paint your dreams, express your fears, celebrate your triumphs, and heal your wounds. At the heart of this platform lies a deep understanding of the value of self-reflection and introspection.";
const aboutContent = "Hi! My name is Aryana Sharma and I am a third year student at Punjab Engineering College, Chandigarh. Your daily personal journal is a digital sanctuary where you can explore the depths of your being, record the moments that shape your life, and embark on a transformative journey of self-discovery. ";
const contactContent = "Phone: 7087380945, Email: aryanasharma3003@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){

  Post.find({}, function(err, posts){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent, imageName: "_ (2).jpg" });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/home", function (req, res){
  res.redirect("/compose");
})

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  post.save(function(err){
    if(!err){
    res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get('/delete/:postId', function(req, res) {
  const postId = req.params.postId;

  Post.findByIdAndRemove(postId, function(err) {
    if (!err) {
      res.redirect('/');
    } else {
      console.log('Failed to delete post: ' + err);
      res.redirect('/');
    }
  });
});



app.get("/edit/:postId", function(req, res) {
  const postId = req.params.postId;

  Post.findById(postId, function(err, post) {
    if (!err) {
      res.render("edit", { post: post });
    } else {
      console.log("Failed to retrieve post for editing: " + err);
      res.redirect("/");
    }
  });
});

app.post("/edit/:postId", function(req, res) {
  const postId = req.params.postId;

  Post.findByIdAndUpdate(postId, { $set: { title: req.body.postTitle, content: req.body.postBody } }, function(
    err,
    post
  ) {
    if (!err) {
      res.redirect("/posts/" + postId);
    } else {
      console.log("Failed to update post: " + err);
      res.redirect("/");
    }
  });
});

app.listen( 3000, function(){
  console.log("Server is running on port 3000");
});

