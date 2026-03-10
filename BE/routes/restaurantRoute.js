const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const {checkAuth,restrictRoleTo} = require('../middleware/auth');

router.post('/createRestaurant',checkAuth,restrictRoleTo(['HOTEL-MANAGER']),restaurantController.createRestaurant);

// router.patch('/edit/:resId',checkAuth,restrictRoleTo(['HOTEL-MANAGER']),restaurantController.editRestaurantDetails);

// router.delete('/:resId',checkAuth,restrictRoleTo(['HOTEL-MANAGER']),restaurantController.deleteRestaurant);
router.get('/',restaurantController.getAllRestaurant);

router.get('/:userId',checkAuth,restrictRoleTo(['HOTEL-MANAGER']),restaurantController.getRestaurantById);

module.exports = router;