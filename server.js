const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
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

// Morgan Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

//Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

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