const express = require('express')
const router = express.Router({ mergeParams: true })
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')

const User = require('../models/User')

const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResult(User), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)
// // router.get('/users', getUsers)

// router.get('/users:id', getUser)

// router.post('/users', protect, createUser)

// router.put('/users/:id', updateUser)

// router.delete('/users/:id', protect, deleteUser)

module.exports = router
