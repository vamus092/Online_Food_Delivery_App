const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const {checkAuth,restrictRoleTo} = require('../middleware/auth');

router.post('/createAgent',checkAuth,restrictRoleTo(['ADMIN']),adminController.createAgent);

router.post('/:orderId/:agentId',checkAuth,restrictRoleTo(['ADMIN']),adminController.assignAgent);

router.get('/agents',checkAuth,restrictRoleTo(['ADMIN']),adminController.getAllAgents);

module.exports = router;