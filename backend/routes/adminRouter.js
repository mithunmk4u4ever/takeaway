const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController')

router.post('/register', adminController.adminRegister)
router.post('/login', adminController.adminLogin)
router.get('/userdata',adminController.getUserData)

module.exports = router