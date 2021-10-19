const express = require('express')
const multer = require('multer')
const router = express.Router()
const { uploadFile } = require('../controllers/uploadfile')

global.__basedir = __dirname 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    },
  })
  
  const upload = multer({ storage: storage })

router.route('/').post(upload.single("uploadfile"), uploadFile)

module.exports = router