const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {

    if(req.user){
        next();
    }

    const token = req.headers.authorization;

    if(token){
        jwt.verify({token: token},JWT_SECRET, (error, decoded) => {
            if(!err){
                req.user = decoded.id;
                next();
            }else{
                res.json({
                    message: "Incorrect Credentials"
                });
            }
        })
    }else{
        res.json({
            message: "Token is required"
        });
    }
}

module.exports = {
    JWT_SECRET,
    auth
};