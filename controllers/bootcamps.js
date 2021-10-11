const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')

//@desc     Get all Bootcamps
//@route    Get /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query

  //Copy req.query
  reqQuery = { ...req.query }

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  //Create query string
  let queryStr = JSON.stringify(reqQuery)

  //Advanced Filtering (Create operators($gt, $gte, etc))
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  //Finding Resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

  //Select Field
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  //Executing query
  const bootcamps = await query

  //Pagination Result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
})

//@desc     Get a single Bootcamp
//@route    Get /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    )
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

//@desc     Create new Bootcamp
//@route    Post /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

//@desc     Edit a Bootcamp
//@route    Put /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    )
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

//@desc     Get all Bootcamps
//@route    Get /api/v1/bootcamps
//@access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    )
  }
  bootcamp.remove()
  res.status(200).json({
    success: true,
    msg: 'Bootcamp Harvest',
  })
})

//@desc     Get Bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance/
//@access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  //Get lng/lat from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //Calc radius using radians
  //Divide Dist by radius of Earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})
