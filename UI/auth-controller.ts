const JTI = require("../models/blacklistToken");
const { User } = require("../models/userModel");
const { Addresses } = require("../models/addressModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/authService");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
 
exports.createUser = async (req, res, next) => {
  let { username, email, password, confirmPassword } = req.body;
 
  if (!username || username === "") {
    return res
      .status(400)
      .json({ message: "Fail", data: "User-Name is required!" });
  }
  if (!email || email === "") {
    return res
      .status(400)
      .json({ message: "Fail", data: "Email is required!" });
  }
  if (!password || password === "") {
    return res
      .status(400)
      .json({ message: "Fail", data: "Password is required!" });
  }
 
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Fail", data: "Confirm Password does not match!" });
  } else {
    try {
      const newAddress = await Addresses.create(req.body.address);
      console.log(newAddress);
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(req.body.password, salt);
      const newUser = await User.create({
        ...req.body,
        dateofBirth: new Date(req.body.dateofBirth),
        password: hash,
        address: newAddress._id,
      });
 
      return res
        .status(201)
        .json(new ApiResponse("User added Successfully...", newUser, 201));
    } catch (err) {
      next(err);
    }
  }
};
 

 
exports.getProfileHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("address");
 
    if (!user) {
      return res.status(404).json(new ApiError("User not found!", null, 404));
    }
 
    res
      .status(200)
      .json(new ApiResponse("User Profile Fetched Successfully...", user, 200));
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json(new ApiError("Invalid or expired token", null, 401, [err.message]));
  }
};
 
 
// ... [Keep your existing createUser function here] ...
 
exports.loginHandler = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({ msg: "Both email and password are required!" });
    }
   
    let user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
   
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Error occurred", error: err.message });
      }
      if (result) {
        let token = generateAccessToken(user);
        let refreshToken = generateRefreshToken(user);
       
        // NO MORE COOKIES! Send tokens directly in the JSON response
        return res.status(200).json({
          message: "User Logged in Successfully...",
          data: user,
          token: token,
          refreshToken: refreshToken,
          statusCode: 200
        });
      } else {
        return res.status(401).json(new ApiResponse("Invalid credentials", null, 401));
      }
    });
   
  } catch (err) {
    next(err);
  }
};
 
exports.refreshTokenHandler = async (req, res) => {
  // Grab the refresh token from the Request BODY instead of cookies
  const { refreshToken } = req.body;
 
  if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });
 
  try {
    const jwt = require('jsonwebtoken'); // Ensure jwt is imported at the top of your file usually
    let decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    let user = await User.findOne({ _id: decode.id });
    if (!user) return res.sendStatus(403);
   
    const newAccessToken = generateAccessToken(decode);
 
    // Send the new token back in JSON format
    return res.status(200).json({
      message: "Access token refreshed",
      token: newAccessToken
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token!" });
  }
};
 
exports.logoutHandler = async (req, res) => {
  let expirationDate = req.user.exp * 1000;
 
  let Jti = await JTI.create({
    jti: req.user.jti,
    userId: req.user.id,
    revokedAt: new Date(),
    expiresAt: expirationDate,
  });
 
  // NO MORE CLEAR COOKIE! The frontend handles clearing sessionStorage.
  return res
    .status(200)
    .json(new ApiResponse("User logout Successfully...", "", 200));
};
 
