const JTI = require('../models/blacklistToken');
const { User } = require('../models/userModel');
const { Addresses } = require('../models/addressModel')
const { generateAccessToken, generateRefreshToken } = require('../utils/authService');
const bcrypt = require('bcrypt');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const saltRounds = 10;

exports.createUser = async (req, res,next) => {
    let { username, email, password, confirmPassword } = req.body;
    console.log("Create User Handler:");
    console.log(req.body);
     console.log("role:", req.body.role);
     
    console.log(req.body);
    if (!username || username === "") {
        return res.status(400).json({ message: "Fail", data: "User-Name is required!" })
    }
    if (!email || email === "") {
        return res.status(400).json({ message: "Fail", data: "Email is required!" })
    }
    if (!password || password === "") {
        return res.status(400).json({ message: "Fail", data: "Password is required!" })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Fail", data: "Confirm Password does not match!" })
    }
    else {
        try {
            const newAddress = await Addresses.create(req.body.address);
            console.log(newAddress);
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(req.body.password, salt);
            const newUser = await User.create({
                ...req.body,
                dateofBirth: new Date(req.body.dob),
                password: hash,
                address: newAddress._id
            })
            console.log(newUser);
            return res.status(201).json(new ApiResponse("User added Successfully...",newUser,201));
        }
        catch (err) {
          
            next(err);
        }
    }
}

exports.loginHandler = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email && !password) {
            return res.status(404).json({ "msg": "Both email and password is required!" });
        }
        else {
            let user = await User.findOne({ email: email }).select('+password');
            if (!user) {
                return res.status(200).json({ "msg": "User not found" })
            }
            else {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        return res.status(500).json({ "message": "Error occurred", error: err.message });
                    }
                    if (result) {
                        let token = generateAccessToken(user);
                        let refreshToken = generateRefreshToken(user);
                    
                        res.cookie("token", token, {
                           
                            sameSite: "Strict",
                            maxAge: 40 * 60 * 1000
                        });
                        res.cookie("refreshToken", refreshToken, {
                            
                            sameSite: "Strict",
                            maxAge: 24 * 60 * 60 * 1000
                        });
                        return res.status(200).json(
                            new ApiResponse("User Logged in Successfully...", user,200)
                        );

                    }
                    else {
                        return res.status(400).json(
                            new ApiResponse("Something Went wrong", null,400)
                        );
                    }
                });
            }
        }
    }
    catch (err) {
        next(err)
    }

}

exports.refreshTokenHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    try {
        let decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        let user = await User.findOne({ _id: decode.id });
        if (!user) return res.sendStatus(403);
        const newAccessToken = generateAccessToken(decode);

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 40 * 60 * 1000
        });
        res.json({ message: "Access token refreshed" });
    }
    catch (err) {
        return res.status(500).json({ "message": "Internal Server Error!" })
    }
}

exports.logoutHandler = async (req, res) => {
    console.log("Logout handler:");
    console.log(req.user);
    let expirationDate = req.user.exp * 1000;

    let Jti = await JTI.create({
        jti: req.user.jti,
        userId: req.user.id,
        revokedAt: new Date(),
        expiresAt: expirationDate
    });

    console.log("JTI Created");
    console.log(Jti);

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse("User logout Successfully...","",200));
}

exports.getProfileHandler = async (req ,res) => {
  try {
    console.log(req.user); // Log the user information from the token

    // Find the user in the database
    const user = await User.findById(req.user.id).select('-password').populate('address');
    console.log("User found in database:");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user profile
    res.status(200).json(new ApiResponse("User Profile Fetched Successfully...", user,200));
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};



