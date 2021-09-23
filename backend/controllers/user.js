console.log('--> active file : user.js in controllers');

// import
const db     = require('../models');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
//const dotenv = require('dotenv');
// solution 3 to get data from dotenv :
require('dotenv').config();

// user id
const userID = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const id = decodedToken.userID;
    return id;
}

// regex for email form control validation
const emailRegex = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Signup 
// Creation of a user profile in the database in MySQL
exports.signup = (req, res, next) => {
    // Looking for the unique email in the database in MySQL
    // so need to find one unique email
    db.User.findOne({
        where: {email: req.body.email}
    })
    .then(user => {
        console.log(user)
        // IF the user is already in the database in MySQL then return a json message for ok
        if (user) {
            return res.status(401).json({error: "Email must be unique ! This user already exists"});
        }
        // ELSE => means the user does not exist in the database in MySQL
        // the unique email is not used yet
        else {
            // step 1 : email form control validation with regex
            // then send a json message for error
            if (!emailRegex(req.body.email)) {
                res.status(400).json({message: "Email form must be like : dave@mail.com"})
            }
            // IF the email form control validation is ok
            // then do step 2 : create user in the database in MySQL
            else {
                // use bcrypt to crypt and hash the password
                // it returns a promise
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    // get the data in the request body : req.body
                    // create the user in the database in MySQL using create method/function
                    db.User.create({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        profilePicture: 'http://localhost:3000/images/unknown.jpeg'
                    })
                    .then(() => res.status(201).json(
                        {message: "Congratualation User Created ! Please update your profile"}
                    ))
                    .catch(error => res.status(500).json({error}))
                })
                .catch(error => res.status(500).json({error}));
            }
        }
    })
    .catch(error => res.status(500).json({error}));
}

// Connection/Connexion => SE CONNECTER AVEC UN PROFIL EXISTANT
// LOGIN with an existing profile
exports.login = (req, res, next) => {
    // Check and control for user email in the database in MySQL
    // so find one : find one user with a unique email in the database in users tables in MySQL
    db.User.findOne({
        where: {email: req.body.email}
    })
    .then(user => {
        // IF the user does not exist, then send json message for warning
        if(!user) {
            return res.status(401).json({error: "User not found !"});
        }
        // brcypt compares the hash : input password, so current hash vs hash stored in the database
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // valid is a boolean
            // if not true, so false, therefore the password is incorrect
            if (!valid) {
                return res.status(401).json({error: "Password incorrect! Please check it again"});
            }
            // IF the valid boolean is true, so the password is correct, then do :
            // the user is the admin of his own account
            else {
                res.status(200).json({
                    userId: user.id,
                    token: jwt.sign(
                        {userId: user.id},
                        process.env.TOKEN,
                        {expiresIn: '24h'}
                    ),
                    userAdmin: user.isAdmin
                })
            }
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
}

// Delete USER -- -- -- important
exports.deleteUser = (req, res, next) => {
    // Looking for the user in the database in MySQL
    // in order to do the delete
    db.User.findOne({
        where: {id: req.params.id}
    })
    .then(user => {
        // IF the user exists, then do :
        if (user) {
            // Who is the user ? Who can delete a user profile ?
            // is it the user himself ? or someone else like the admin of the database/socialnetwork ?
            db.User.findOne({
                where: {id: userID(req)}
            })
            .then(admin => {
                // IF the user wants to delete his own account or if an admin does it
                // isAdmin = 0 = false and isAdmin = 1 = true
                if(user.id === admin.id || admin.isAdmin === true) {
                    // delete the user with destroy method/function
                    db.User.destroy({
                        where: {id: req.params.id}
                    })
                    .then(() => res.status(200).json({message: "User profile deleted with success !"}))
                    .catch(error => res.status(400).json({error}));
                }
                // IF the user is not authorize to delete this account, then send json message for warning
                else {
                    res.status(403).json({message: "Action DELETE is not authorized"})
                }
            })
            .catch(error => res.status(500).json({error}))
        } 
        // ELSE the user does not exist
        else {
            res.status(404).json({message: "User does not exist"})
        }
    })
    .catch(error => res.status(500).json({error}))
}

// Edit / Update an existing user profile
exports.editUser = (req, res, next) => {
    
    // Looking for an user id : the one in the request parameters, so use req + params + id
    db.User.findOne({
        where: {id: req.params.id}
    })
    .then(user => {
        // IF the user exists, then do :
        if (user) {
            // who is the used with id = ?
            // use find one where id = user id in req
            db.User.findOne({
                where: {id: userID(req)}
            })
            .then(admin => {
                // IF the user wants to update/modify his own account or if the user is the admin of database/socialnetwork
                if (user.id === userID(req) || admin.isAdmin === true) {
                    // default image when creating the profil
                    let imageDefault;
                    if (!req.file) {
                        if(user.profilePicture == null) {
                            imageDefault = 'http://localhost:3000/images/unknown.jpeg'
                        } else {
                            imageDefault = user.profilePicture
                        }
                    } else {
                        imageDefault = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }
                    // update / modify the user data in the database in MySQL
                    db.User.update(
                        {firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        department: req.body.department,
                        profilePicture: imageDefault}, 
                        {where: {id: req.params.id},
                    })
                    .then(() => res.status(201).json({message: "User profile updated ! This is better now"}))
                    .catch(error => res.status(400).json({error}))
                }
                // ELSE : the user cannot update/modify his profile => no authorization
                else {
                    res.status(403).json({message: "Sorry, you cannot do UPDATE now"})
                }
            })
            .catch(error => res.status(500).json({error}))   
        }
        // ELSE the user does not exist
        else {
            res.status(404).json({message: "User does not exist"})
        }
    })
    .catch(error => res.status(500).json({error}))
}

// GET all users at once
// use find all
// get all data from the database in MySQL = all columns
exports.getAllUsers = (req, res, next) => {
    db.User.findAll({
        attributes: ['id', 'firstname', 'lastname', 'email', 'department', 'profilePicture', 'createdAt']
    })
    .then(user => res.status(200).json({user}))
    .catch(error => { res.status(500).json({error})})
}


// GET only ONE user at a time
// use find one with the id which comes from the params in the req
exports.getOneUser = (req, res, next) => {
    db.User.findOne({
        where: {id: req.params.id},
        attributes: ['id', 'firstname', 'lastname', 'email', 'department', 'profilePicture', 'createdAt']
    })
    .then(user => res.status(200).json(user))
    .catch(error => { res.status(500).json({error})})
}