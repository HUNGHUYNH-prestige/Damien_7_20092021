console.log('--> active file : like.js in controllers');

// import
const db = require('../models');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');

// user id
const userID = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const id = decodedToken.userId;
    return id;
}

// Like a Post
exports.likePost = (req, res, next) => {
    const postID = req.params.id;
    // find one user id for one like : already liked or not in the req params => look for : id
    db.Like.findOne({
        where: { userId: userID(req), postId: postID}
    })
    .then(like => {
        // IF the user has already liked the post
        if (like) {
            console.log(like)
            // destroy / delete the like in the likes (MySQL table) = like (in models folder in Sequelize)
            db.Like.destroy({
                where: { userId: userID(req), postId: postID }
            })
            .then(() => res.status(200).json({message: "Like deleted !"}))
            .catch((error) => res.status(400).json({error}))
        } 
        // ELSE the user has not liked yet, so this is a new like for the post
        else {
            // create the like in the table likes in MySQL for the user id in the post id
            db.Like.create({
                userId: userID(req),
                postId: postID
            })
            .then(() => res.status(201).json({message: "Like added !"}))
            .catch((error) => res.status(400).json({error}))
        }
    })
    .catch((error) => res.status(500).json({error}));
}

// Get / display the user like on the post
exports.getOneLike = (req, res, next) => {
    db.Like.findOne({
        where: {userId: userID(req), postId: req.params.id}
    })
    .then(like => {
        res.status(200).json(like)
    })
    .catch(error => res.status(404).json({error}))
}

// Get all likes for the post
exports.getAllLikes = (req, res, next) => {
    db.Like.findAll({
        where: {postId: req.params.id},
    })
    .then(likes => res.status(200).json(likes))
    .catch(error => res.status(404).json({error}))
}
