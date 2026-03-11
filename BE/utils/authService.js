const jwt = require('jsonwebtoken');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');

function generateAccessToken(user){
    let payload = {
        jti: uuidv4(),
        id:user._id,
        email:user.email,
        role:user.role
    }
    const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
    return token;
}

function generateRefreshToken(user){
    let payload = {
        id:user._id,
        email:user.email,
        password:user.password,
        role:user.role
    }
    const token = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
    return token;
}

async function verifyUser(token,secret){
   let decode = jwt.verify(token,secret);
   console.log("Verify");
   console.log(decode);
   return decode;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyUser
}