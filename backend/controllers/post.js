console.log('--> active file : post.js in controllers');

// import
const db = require('../models');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// user id
const userID = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const id = decodedToken.userId;
    return id;
}

// Post creation
exports.createPost = (req, res, next) => {
    let imageDefault;
    // IF there is no image set as profile, do nothing
    if (!req.file) {
        return;
    } 
    // ELSE there is an image profile set
    else {
        imageDefault = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    // Create the POST in the database in MySQL
    db.Post.create({
        title: req.body.title,
        media: imageDefault,
        userId: req.body.userId
    })
    .then(() => res.status(201).json({message: "New Post Created ! This is nice"}))
    .catch(error => res.status(400).json({error}));
}

// Edit / modify / update a POST
exports.editPost = (req, res, next) => {
    // Find one post in req params by id : who create the post ?
    db.Post.findOne({
        where: {id: req.params.id},
        include: [
            {
                model: db.User,
                attributes: ["id", "firstname", "lastname", "email", "department", "profilePicture", "isAdmin"]
            },
        ]
    })
    .then(post => {
        // IF existing POST in the database in MySQL, then do :
        if (post) {
            // who create the post use : find one post by id
            db.User.findOne({
                where: {id: userID(req)}
            })
            .then(user => {
                // IF the user is the post creator or if the admin needs to edit the post
                if (post.User.id === userID(req) || user.isAdmin === true ) {
                    let imageDefault;
                    // IF there is no image, then do nothing
                    if (!req.file) {
                        if (post.media == null) {
                            imageDefault = null;
                        } else {
                            imageDefault = post.media
                        }                        
                    } 
                    // ELSE there is an image set as user profile, then do : import image from images folder
                    else {
                        imageDefault = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }
                    // once everything is done, update the user profile with : req.body
                    db.Post.update(
                        {title: req.body.title,
                        media: imageDefault,
                        userId: req.body.userId},
                        { where: {id: req.params.id}}
                    )
                    .then(() => res.status(201).json({message: "Post modified with success ! This is better now"}))
                    .catch(error => res.status(400).json({error}))
                } 
                // ELSE the user is not authorized to modify the post, then send json message for warning
                else {
                    res.status(403).json({erreur: "Sorry, you cannot do modification on this post now !"})
                }
            })
            .catch(error => res.status(500).json({error}))
        }
        // ELSE there is no existing post
        else {
            res.status(404).json({erreur: 'Post not found !'})
        }
    })
    .catch(error => res.status(500).json({error}))
}

// Delete a post
exports.deletePost = (req, res, next) => {
    // req params id : to look for the user id who wants to do the delete post
    db.Post.findOne({
        where: {id: req.params.id},
        include: [
            {
                model: db.User,
                attributes: ["id", "firstname", "lastname", "email", "department", "profilePicture", "isAdmin"]
            },
        ]
    })
    .then(post => {
        // IF the post does exist, then do :
        if (post) {
            // find one user id in the database in MySQL who wants to delete this post
            db.User.findOne({
                where: {id: userID(req)}
            })
            .then(admin => {
                // can this user id delete his own post ? does the user id is an admin ?
                if (post.userId == userID(req) || admin.isAdmin === true) {
                    const filename = post.media.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        // Delete the post from the database in MySQL : by id in the params of the req
                        db.Post.destroy({
                            where: {id: req.params.id}
                        })
                        .then(() => res.status(200).json({message: "Post deleted with success !"}))
                        .catch(error => res.status(400).json({error}));
                    })
                } 
                // ELSE the user cannont delete this post, then send json message for warning
                else {
                    res.status(403).json({message: "You cannot delete this post now !"})
                }
            })
            .catch(error => res.status(500).json({error}))
        }
        // ELSE the post does not exist, then do : send json message for warning
        else {
            res.status(404).json({erreur: "Post does not exist !"})
        }
    })
    .catch(error => res.status(500).json({error}));
}

// GET and display all posts with find all in the database in MySQL
exports.getAllPosts = (req, res, next) => {
    db.Post.findAll({
        attributes: ['id', 'title', 'media', 'createdAt'],
        order: [
            ['createdAt', 'DESC']
        ],
        // JOIN TABLE with the include
        include: [
            {
                model: db.User,
                attributes: ["id", "firstname", "lastname", "email", "department", "profilePicture", "isAdmin"]
            },
            {
                model: db.Like,
                attributes: ["userId"]
            },
            {
                model: db.Comment,
                attributes: ['id', "postId"]
            }
        ]
    })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({error}));
}

// Get all Posts for one user id : all posts of this user id
exports.getPostsByUserId = (req, res, next) => {
    db.Post.findAll({
        // the user id is in the req params 
        where: {userId: req.params.userId},
        attributes: ['id', 'title', 'media', 'createdAt'],
        order: [
            ['createdAt', 'DESC']
        ],
        // JOIN TABLE with include
        include: [
            {
                model: db.User,
                attributes: ["id", "firstname", "lastname", "email", "department", "profilePicture", "isAdmin"]
            },
            {
                model: db.Like,
                attributes: ["userId"]
            },
            {
                model: db.Comment,
                attributes: ['id', "postId"]
            }
        ]
    })
    .then(posts => {
        // IF posts do exit, then do : display
        if (posts.length >= 1) {
            res.status(200).json(posts)
        } 
        // ELSE posts do not exist, then do : send json message for warning
        else {
            res.status(404).json({message: "Nothing to display."})
        }
    })
    .catch(error => res.status(400).json({error}));
}

// GET only ONE Post for one user id
exports.getOnePost = (req, res, next) => {
    db.Post.findOne({
        attributes: ['id', 'title', 'media', 'createdAt'],
        include: [
            {
                model: db.User,
                attributes: ["id", "firstname", "lastname", "email", "department", "profilePicture", "isAdmin"]
            },
            {
                model: db.Like,
                attributes: ["userId"]
            }
        ],
        where: {id: req.params.id}
    })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({error}));
}