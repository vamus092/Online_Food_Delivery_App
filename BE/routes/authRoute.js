const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post("/register",authController.createUser);

router.post("/login",authController.loginHandler);

router.post('/logout', checkAuth,authController.logoutHandler);

router.post("/refresh",authController.refreshTokenHandler);

router.get("/profile",checkAuth,authController.getProfileHandler);

module.exports = router;