const mongoose = require('mongoose')
const config = require('../config/config')

const ExamSchema = new mongoose.Schema({

    examId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    types: [String],
    subtypes: [String],
    isActive: { type: Boolean, default: false },
    url: { type: String },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    description: { type: String },
    duration: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    date: { type: Date }

}, { timestamps: true })

module.exports = mongoose.model('Exam', ExamSchema)