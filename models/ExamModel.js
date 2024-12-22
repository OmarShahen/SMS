const mongoose = require('mongoose')
const config = require('../config/config')

const ExamSchema = new mongoose.Schema({

    examId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId },
    courseId: { type: mongoose.Types.ObjectId },
    groups: [mongoose.Types.ObjectId],
    name: { type: String, required: true },
    type: { type: String, enum: config.EXAM_TYPES },
    subtype: { type: String, enum: config.EXAM_SUBTYPES },
    chapters: [String],
    isActive: { type: Boolean, default: false },
    url: { type: String },
    answeredURL: { type: String },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    description: { type: String },
    duration: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    date: { type: Date }

}, { timestamps: true })

module.exports = mongoose.model('Exam', ExamSchema)