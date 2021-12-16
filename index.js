const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")


// Import models 
const Post = require('./src/models/post');


// Define application 
const app = express()

// Define Database Connection 
const db = mongoose.connect('mongodb://localhost:27017/first-node-api-db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    res.send({ ping: 'pong' })
})

// Get values from request payload/Create Posts
app.post('/posts', function (req, res) {
    const title = req.body.title
    const author = req.body.author
    const content = req.body.content

    // Assign values to Post model 
    var post = new Post();
    post.title = title
    post.author = author
    post.content = content

    // Save the post 
    post.save(function (error, savedPost) {
        if (error) {
            res.status(500).send({ error: "Unable to save post" })
        }
        else {
            res.status(200).send(savedPost)
        }
    })
    // res.send({title:title,author:author,content:content})

});

// Get list of all posts
app.get('/posts', function (req, res) {
    Post.find({}, function (error, posts) {
        if (error) {
            res.status(422).send({ error: "Unable to fetch post" })
        }
        else {
            res.status(200).send(posts)
        }
    })
})

// Get a single order 
app.get('/posts/:id', function (req, res) {
    const order_id= req.params.id
    Post.findById(order_id, function (error, postId) {
        if (error) {
            res.status(422).send({ error: "Unable to fetch post" })
        }
        else {
            res.status(200).send(postId)
        }
    })
});

// Delete a order 
app.delete('/posts/:id', function (req, res) {
    const order_id = req.params.id
    Post.findByIdAndRemove(order_id, function (error) {
        if (error) {
            res.status(422).send({ error: "Unable to delete post" })
        }
        else {
            res.status(200).send("Post Deleted")
        }
    })
})

// Update a order 

app.patch('/posts/:id', function (req, res) {
    const update_id = req.params.id
    const updt=Post.findByIdAndUpdate({_id:update_id},req.body,function(error,updt){
        if (error) {
            res.status(422).send({ error: "Unable to update post" })
        } else {
            res.status(200).send(updt)
        }
    })
    
});



app.listen(3001, function () {
    console.log("Server is running at port 3001")
})

