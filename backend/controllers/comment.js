console.log('--> active file : comment.js in controllers');

// import
const db = require('../models');
const jwt = require('jsonwebtoken');

// user id
const userID = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const id = decodedToken.userId;
    return id;
}

// Create a comment
exports.createComment = (req, res, next) => {
    db.Comment.create({
        content: req.body.content,
        userId: userID(req),
        postId: req.params.id
    })
    .then(() => res.status(200).json({message: "Comment added !"}))
    .catch((error) => res.status(403).json({error}))
}

// Modify the comment
exports.editComment = (req, res, next) => {
    // find one comment in the req params => by id
    db.Comment.findOne({
        where: {id: req.params.id, postId: req.params.postId, 
        }
    })
    .then(comment => {
        // IF the comment does not exist
        if (comment) {
            // find one user id => create comment in req
            db.User.findOne({
                where: {id: userID(req)},
            })
            .then(user => {
                // ID user id is the creator of the comment or if the user is the admin
                if (comment.userId === userID(req) || user.isAdmin === true) {
                    // Update the comment
                    db.Comment.update(
                        {content: req.body.content},
                        {where: {id: req.params.id}}
                    )
                    .then(() => res.status(201).json({message: 'Comment updated !'}))
                    .catch(error => res.status(400).json({error}))
                } 
                // ELSE the user cannot do update on the comment then : sens json message for warning
                else {
                    res.status(403).json({erreur: "Sorry, you cannot modify this comment !"})
                }
            })
            .catch(error => res.status(500).json({error}))
        } 
        // ELSE the comment does not exist
        else {
            res.status(404).json({erreur: 'Comment not found !'})
        }
    })
    .catch(error => res.status(500).json({error}))
}

// Delete a comment
exports.deleteComment = (req, res, next) => {
    // find one comment by id : in the req params then post id, take a look into the posts table in MySQL : postId
    db.Comment.findOne({
        where: {id: req.params.id, postId: req.params.postId}
    })
    .then(comment => {
        // IF the comment does exist in the database in MySQL, then do :
        if(comment) {
            // find one user id in the req
            db.User.findOne({
                where: {id: userID(req)}
            })
            .then(user => {
                // IF the user id is the owner or the admin of the comment
                if (comment.userId === userID(req) || user.isAdmin === true) {
                    db.Comment.destroy({
                        where: {id: req.params.id}
                    })
                    .then(() => res.status(200).json({message: "Comment deleted with success !"}))
                    .catch((error) => res.status(400).json({error}));
                }
                // ELSE the user cannot do delete on the comment, then send json message for warning
                else {
                    res.status(403).json({erreur: "Sorry, you cannot delete this comment !"})
                }
            })
            .catch(error => res.status(500).json({error}))

        } 
        // ELSE the comment does not exist
        else {
            res.status(404).json({erreur: "Comment not found"})
        }
    })
    .catch(error => res.status(500).json({error}));
}

// GET all comments at once
exports.getAllComments = (req, res, next) => {
    db.Comment.findAll({
        // select id, content, userId, postId, createdAt from users
        attributes: ['id', 'content', 'userId', 'postId', 'createdAt'],
        // order by createdAt DESC
        order: [
            ['createdAt', 'DESC']
        ],
        // JOIN TABLES like inner join
        include: [
            {
                model: db.User,
                attributes: ['id', 'firstname', 'lastname', 'department', 'profilePicture']
            },
            {
                model: db.Post,
                attributes: ['id']
            }
        ],
        where: {postId: req.params.id}
    })
    .then((comments) => {
        res.status(200).json(comments)
    })
    .catch((error) => {
        res.status(400).json({error})
    })
}

// GET only one comment at a time
exports.getOneComment = (req, res, next) => {
    db.Comment.findOne({
        where: {id: req.params.id, postId: req.params.postId},
        include: [
            {
                model: db.Post,
            }
        ]
    })
    .then(comment => {
        if (comment) {
            res.status(200).json(comment)
        } else {
            res.status(404).json({erreur: 'Comment not found !'})
        }
    })
    .catch(error => res.status(500).json({error}))
}