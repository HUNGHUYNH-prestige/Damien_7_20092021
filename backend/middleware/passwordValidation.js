const passwordValidator = require('password-validator');

// Définition du modèle du mot de passe
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) // minimum length 8
.is().max(30) // maximum length 30
.has().uppercase(1) // must have uppercase
.has().lowercase(1) // must have lowercase
.has().digits(2) // must have at least 2 digits
.has().not().spaces()  // should not have space
.is().not().oneOf(['Passw0rd', 'Password123']); // blacklist these values

// checking the password : validation password form
module.exports = (req, res, next) => {
    // IF the password is not like the passwordSchema then do : send json message for warning
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({message: "Password : minimum length is 8, must have uppercase, lowercase, at least 2 digits, no space"});
        console.log(passwordSchema.validate(req.body.password, { list: true }));
    } 
    // ELSE if the password is correctly formatted according to passwordSchema
    else {
        next()
    }
}