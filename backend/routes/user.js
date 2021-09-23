// import
const express            = require('express');
const router             = express.Router();
const userCtrl           = require('../controllers/user');
const auth               = require('../middleware/auth');
const multer             = require('../middleware/multer-config');
const passwordValidation = require('../middleware/passwordValidation')

// routes
router.post('/signup', passwordValidation, userCtrl.signup);
router.post('/login',                      userCtrl.login);
router.delete('/:id',  auth, multer,       userCtrl.deleteUser);
router.put('/:id',     auth, multer,       userCtrl.editUser);
router.get('/',        auth,               userCtrl.getAllUsers);
router.get('/:id',     auth,               userCtrl.getOneUser);

console.log('--->');
console.log('this is ok for user.js in routes');
console.log('--->');

// export
module.exports = router;