const mongoose = require('mongoose')
const config = require('../config/config')

const AssignmentSchema = new mongoose.Schema({

    assignmentId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId },
    courseId: { type: mongoose.Types.ObjectId },
    groups: [mongoose.Types.ObjectId],
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    totalMarks: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    url: { type: String },

}, { timestamps: true })


module.exports = mongoose.model('Assignment', AssignmentSchema)