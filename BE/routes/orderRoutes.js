const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {checkAuth,restrictRoleTo} = require('../middleware/auth');

// 1. POST - Place order with mock items
router.post('/createOrder/:userId',checkAuth,restrictRoleTo(['USER']),orderController.placeOrder);

// 2. GET - View specific order (Note: userID is used for security check)
router.get('/:userID',checkAuth,restrictRoleTo(['USER']),orderController.getOrderByUserId);

// 3. GET - List all orders 
router.get('/',checkAuth,restrictRoleTo(['HOTEL-MANAGER','ADMIN']),orderController.getAllOrders);

// 4. PUT - Initiate payment (Partial Update)
router.post('/payment/:OrderID',checkAuth,restrictRoleTo(['USER']),orderController.initiatePayment);

router.post('/:orderId',checkAuth,restrictRoleTo(['HOTEL-MANAGER','ADMIN']),orderController.changeDeliveryStatus);

module.exports = router;