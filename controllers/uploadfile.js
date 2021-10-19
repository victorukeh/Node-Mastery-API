const asyncHandler = require('../middleware/async')
const UploadExcelFile = require('../models/UploadFile')
const ErrorResponse = require('../utils/errorResponse')

exports.uploadFile =  asyncHandler( async (req, res, next) => {
  const excelFile = await UploadExcelFile.findById(req.params.id)
  if (!excelFile) {
    return next(
      new ErrorResponse(`File not found with an id of ${req.params.id}`, 404)
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }

//   if (!file.mimetype.startsWith('xlsx' || 'xlsb' || 'xls' || 'xlsm' || 'csv')) {
//     return next(new ErrorResponse(`Please upload an excel file`))
//   }

  res.status(200).json({
    success: true,
    data: 'file uploaded successfully',
  })
})
