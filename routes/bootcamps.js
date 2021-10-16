const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps')

const Bootcamps = require('../models/Bootcamp')

const advancedResults = require('../middleware/advancedResult')

//Include other Resource Routers
const courseRouter = require('./courses')

const router = express.Router()

const { protect } = require('../middleware/auth')

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router
  .route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)

router
  .route('/')
  .get(advancedResults(Bootcamps, 'courses'), getBootcamps)
  .post(protect, createBootcamp)

router.route('/:id/photo').put(protect, bootcampPhotoUpload)

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp)

module.exports = router
