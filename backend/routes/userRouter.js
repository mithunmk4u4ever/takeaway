const express = require('express')
const router = express.Router();
const userController=require('../controllers/userController')
const userMiddleware=require("../middlewares/userMiddleware")

router.post('/createuser', userController.createUser)
router.post('/loginuser', userController.loginUser, userMiddleware);
router.post("/forgot-password",userController.userForgotPassword)
router.post('/reset-password/:id/:token', userController.userResetPassword)
router.post("/foodData",userMiddleware, userController.getFoodData)
// router.post("/foodData",userMiddleware, userController.getFoodData)

router.post('/addtocart',userMiddleware, userController.addToCart);
router.post('/getcartitems',userMiddleware, userController.getCartItems);

router.post('/removesinlgefromcart', userController.removeSingleFromCart);
router.post('/removeselectedfromcart', userController.removeSelectedFromCart);

router.post("/makepayment",userController.makePayment)
router.post("/validatepayment",userController.validatePayment)

router.post('/addaddress',userController.addAddress)
router.get('/address/:userEmail',userController.getAddress)


router.post('/movetomyorder', userController.moveSelectedToMyOrder)
router.post("/myorder",userMiddleware, userController.myOrderData)


module.exports = router