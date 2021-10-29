const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const path = require('path')
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require('hpp')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

// Load environmental variables
dotenv.config({
  path: './config/config.env',
})

//Connect to database
connectDB()

const app = express()

//Body Parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Morgan Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//File Uploading
app.use(fileupload())

//Sanitize data
app.use(mongoSanitize())

//Set security headers
app.use(helmet())

//Prevent XSS attacks
app.use(xss())

//Rate limiting
const limiter = rateLimit({
  windows: 10 * 60 * 1000,    //10 min
  max: 100
})

app.use(limiter)

//Prevent http param pollution
app.use(hpp())

//Enable Cors
app.use(cors())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

//Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

//Handle Unhandled Rejections
process.on('unhandledRejection', (err, promise) => {
  // console.log(`Error: ${err}`.red);
  // process.exit(0);
  // 1: Is for when we want the app to crash
  // 0: is for
  console.log(`Error: ${err.message}`.red)
  server.close(() => process.exit(1))
})

// const logger = require('./middleware/logger');
// app.use(logger);
