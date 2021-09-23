// import
const jwt = require('jsonwebtoken');

// authentication with jsonwebtoken
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;

        // IF the user id is not correct then do : send json message for warning
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID is not correct";
        }
        // ELSE the user id is correct, then do : nothing, just go next()
        else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Sorry, authentication failed !')
        })
    }
}