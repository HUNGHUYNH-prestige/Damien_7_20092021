// import
const express     = require('express');
const router      = express.Router();
const postCtrl    = require('../controllers/post');
const commentCtrl = require('../controllers/comment')
const likeCtrl    = require('../controllers/like');
const auth        = require('../middleware/auth');
const multer      = require('../middleware/multer-config');

// information :
// in MySQL : tables with 's' like posts
// in models folder : files for models without 's' like post

// routes -- -- -- post = posts
router.post('/',             auth, multer, postCtrl.createPost);
router.put('/:id',           auth, multer, postCtrl.editPost);
router.delete('/:id',        auth, multer, postCtrl.deletePost);
router.get('/',              auth,         postCtrl.getAllPosts);
router.get('/users/:userId', auth,         postCtrl.getPostsByUserId);
router.get('/:id',           auth,         postCtrl.getOnePost);

// routes -- -- -- comment = comments
router.post('/:id/comments',           auth, commentCtrl.createComment);
router.put('/:postId/comments/:id',    auth, commentCtrl.editComment)
router.delete('/:postId/comments/:id', auth, commentCtrl.deleteComment);
router.get('/:id/comments',            auth, commentCtrl.getAllComments);
router.get('/:postId/comments/:id',    auth, commentCtrl.getOneComment);

// routes -- -- -- like = likes
router.post('/:id/likes', auth, likeCtrl.likePost);
router.get('/:id/like',   auth, likeCtrl.getOneLike);
router.get('/:id/likes',  auth, likeCtrl.getAllLikes);

console.log('--->');
console.log('this is ok for post in routes');
console.log('--->');

// export
module.exports = router;