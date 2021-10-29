const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc     Get Reviews
// @route    GET /api/v1/reviews
// @route    GET /api/v1/bootcamps/:bootcampId/reviews
// @access   Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc     Get Single Review
// @route    GET /api/v1//:id
// @access   Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })
  if (!review) {
    return next(
      new ErrorResponse(`No course with an id of ${req.params.id}`),
      404
    )
  }

  res.status(200).json({
    success: true,
    data: review,
  })
})

//@desc     Add Review
//@route    POST /api/v1/bootcamps/:bootcampId/reviews
//@access   Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamps with an Id of ${req.params.bootcampId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

// @desc      Update Review
// @route     PUT api/v1/review/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`No Review with the Id of ${req.params.Id}`, 404)
    )
  }

  //Make sure user is course owner
  if (review.user.toString() !== req.user.id || req.user.role === 'publisher') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review with ID ${review._id}`,
        401
      )
    )
  }

  if (!req.body) {
    return next(new ErrorResponse(`Please add some input`, 401))
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review,
  })
})

// @desc      Delete Review
// @route     DELETE api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Review with Id ${req.params.id} was not found`, 404)
    )
  }

  if (review.user.id !== req.user.id || req.user.role === 'publisher') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update bootcamp with ID ${review._id}`,
        401
      )
    )
  }

  review = Review.findByIdAndDelete(req.params.id)
  res.status(200).json({
    succes: true,
    message: 'Review has been deleted',
  })
})
