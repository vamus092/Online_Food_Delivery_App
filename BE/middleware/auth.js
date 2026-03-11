const JTI = require('../models/blacklistToken');
const { User } = require('../models/userModel');
const { verifyUser } = require('../utils/authService');
require('dotenv').config();


async function checkAuth(req, res, next) {
    let token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ status:"Fail",message: "Token expired!" })
    }
    else {
        let decoded = await verifyUser(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("CheckAuth")
        // console.log(decoded);
        let user = await User.findOne({ _id: decoded.id });
        let Jti = await JTI.findOne({ jti: decoded.jti});
        // console.log("CheckAuth -JTI ", Jti);
        if (Jti) {
            return res.status(401).json({ status: "Fail", message: "Token Revoked..." });
        }
        if (!user) {
            return res.status(401).json({ status: "Fail", message: "User with given token does not exists" });
        }
        req.user = decoded;
        next();
    }
}

function restrictRoleTo(roles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(500).json({ "Message": "User not logged In!" });
        }
        else if (!roles.includes(req.user.role)) {
            return res.status(401).json({ "message": "You are unauthorized!" });
        }
        next();
    }
}

module.exports = {
    checkAuth,
    restrictRoleTo
}
