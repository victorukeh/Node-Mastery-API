const express = require('express')
const router = express.Router()
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/auth')

const { protect } = require('../middleware/auth')

router.post('/register', register)

router.post('/login', login)

router.get('/me', protect, getMe)

router.get('/logout', logout)

router.post('/forgotpassword', forgotPassword)

router.put('/updatedetails', protect, updateDetails)

router.put('/updatepassword', protect, updatePassword)

router.put('/resetpassword/:resetToken', resetPassword)
module.exports = router
