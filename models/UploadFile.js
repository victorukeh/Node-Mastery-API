const mongoose = require('mongoose')

const uploadFileSchema = new mongoose.Schema({
  name: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('UploadExcelFile', uploadFileSchema)
