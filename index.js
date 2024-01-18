import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// array containing all the post objects
let allPosts = [];

// functions for post object

function post(title, content) {
    this.title = title;
    this.content = content;
    this.rawDate = new Date();
    this.date = this.rawDate.toLocaleString();
};

function addPost(title, content) {
    let newPost = new post(title, content);
    allPosts.push(newPost);
}

function deletePost(index) {
    allPosts.splice(index, 1);
};

function editPost(index, title, content) {
    allPosts[index] = new post(title, content);
};

// express methods

app.get("/", (req,res) => {
    res.render("home.ejs", {
        posts: allPosts
    });
});

app.get("/create", (req,res) => {
    res.render("create.ejs")
});

app.get("/view/:id", (req,res) => {
    let index = req.params.id;
    let post = allPosts[index]
    res.render("view.ejs", {
        postID: index,
        title: post.title,
        content: post.content
    })
});

app.get("/edit/:id", (req,res) => {
    let index = req.params.id;
    let post = allPosts[index];
    res.render("edit.ejs", {
        postID: index,
        title: post.title,
        content: post.content
    })
});

app.post("/save", (req,res) => {
    let title = req.body["title"];
    let content = req.body["content"];
    addPost(title, content);
    res.redirect("/")
});

app.post("/delete", (req,res) => {
    let index = req.body["postID"]
    deletePost(index);
    res.redirect("/")
});

app.post("/update", (req,res) => {
    let index = req.body["postID"]
    let title = req.body["title"];
    let content = req.body["content"];
    editPost(index, title, content)
    res.redirect("/")
});

app.listen(port, () => {
    console.log(`Running on port ${port}`)
    addPost("Welcome to ByteBlog!", "You can make, edit, and delete posts!")
});

