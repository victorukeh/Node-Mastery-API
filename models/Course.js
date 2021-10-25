const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a Course Title'],
  },

  description: {
    type: String,
    required: [true, 'Please add a description'],
  },

  weeks: {
    type: Number,
    required: [true, 'Please add number of weeks'],
  },

  tuition: {
    type: Number,
    required: [true, 'Please add tuition cost'],
  },

  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },

  scholarshipsAvailable: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

//A static method (or static function) is a method defined as a member of an object but
// is accessible directly from an API object's constructor, rather than from an object
//instance created via the constructor.
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // console.log('Calculating avg cost...'.blue)

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ])
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    })
  } catch (err) {
      console.log(err)
  }
}



// Call getAverageCost after save
CourseSchema.post('save', function () {
  //Constructor is used to initialize an object instance of class
  this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)
