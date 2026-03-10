const express = require('express');
const router = express.Router();
const menuController  = require('../controllers/menuController');
const {checkAuth,restrictRoleTo} = require('../middleware/auth');
const uploadMiddleware = require('../utils/multerConfig');

router.get('/:itemId',menuController.getMenuById);

router.get('/',checkAuth,menuController.getAllMenus);

router.post('/createMenu/:resId',uploadMiddleware,checkAuth,restrictRoleTo(['HOTEL-MANAGER']),menuController.createMenu);

router.put('/edit/:id',checkAuth,restrictRoleTo(['HOTEL-MANAGER']),menuController.editMenuItem);
//Delete Menu Items 

router.delete('/:menuId/:itemId',checkAuth,restrictRoleTo(['HOTEL-MANAGER']),menuController.deleteMenuItem);

// Delete menu at Once
// router.delete("/:menuId/restaurant/:resId",checkAuth,restrictRoleTo(['HOTEL-MANAGER']),menuController.deleteMenu);

router.get('/section/:resId/:sectionName',menuController.getMenuBySectionName);


router.get('/searchItems/:resId/:sectionName',menuController.getMenuItems);

module.exports = router;