const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({

    courseId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId, required: true },
    specializationId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, default: 0, min: 0 },
    description: { type: String },

}, { timestamps: true })


module.exports = mongoose.model('Course', CourseSchema)