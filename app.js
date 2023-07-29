const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'});

const homeStartingContent = "Hello there, and welcome to my digital realm of coding wonders! I'm Riya, and I'm thrilled to have you here. If you share a fascination for the art of coding and the limitless possibilities it brings, then you're in the right place. This blog is all about unraveling the magic of programming, one line at a time. Step into the enchanting world of coding where ideas become reality, and imagination knows no bounds.";
const aboutContent = "Hey there! I'm Riya Dutta, a passionate coder and technology enthusiast. I have always been captivated by the way software and technology can shape our world and make it a better place. This blog is my little corner of the internet where I get to share my thoughts, experiences, and insights about the fascinating world of coding. I believe that coding is not just a skill but a creative art that empowers us to bring our ideas to life. Through this platform, I aim to inspire others, especially beginners, to take their first steps into the coding world and discover the wonders it offers.";
const contactContent = "Thank you for visiting, Coding Chronicles! I'm thrilled that you're interested in reaching out to me. Whether you have a question, feedback, collaboration proposal, or just want to say hello, I'd love to hear from you. Connecting with like-minded individuals is one of the things that make the coding community so special, so don't hesitate to get in touch!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}).
  then( posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/dashboard", function(req, res){
  Post.find({}).
  then( posts => {
    res.render("dashboard", {
      posts: posts
      });
  });
})

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save().
  then( result => {
        res.redirect("/");
    }
  ).
  catch(err => {
    console.log(err);
  });
});

app.get("/edit-post/:postId", function(req, res){
  const requestedPostId = req.params.postId;
      Post.findOne({_id: requestedPostId})
      .then(post => {
        res.render('edit', { 
          post: post
        }); })
        .catch(err => console.log(err)); 
})

app.post("/edit-post/:postId", function(req, res){
  const requestedPostId = req.params.postId;
      Post.findOneAndUpdate({_id: requestedPostId},{title: req.body.postTitle, content: req.body.postBody})
      .then(result => {
        res.redirect('/dashboard');
      })
      .catch(err => console.log(err));
})

app.post("/delete-post/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.deleteOne({_id: requestedPostId})
  .then(() => {
    res.redirect('/dashboard');
    }).
  catch(err => {
    console.log(err);
  });
})

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}).
  then(post => {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }).
  catch(err => {
    console.log(err);
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

const PORT = process.env.PORT;

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
