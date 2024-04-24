const express = require('express')
const router = express.Router();
const userController=require('../controllers/userController')
const userMiddleware=require("../middlewares/userMiddleware")

router.post('/createuser', userController.createUser)
router.post('/loginuser', userController.loginUser, userMiddleware);
router.post("/foodData",userMiddleware, userController.getFoodData)
router.post('/addtocart',userMiddleware, userController.addToCart);
router.post('/getcartitems',userMiddleware, userController.getCartItems);

router.post('/createorder',userMiddleware, userController.orderData)
router.post("/myorder",userMiddleware, userController.myOrderData)
router.post('/removefromcart',userMiddleware, userController.removeFromCart);
router.post('/movetomyorder', userController.moveToMyOrder)


module.exports = router