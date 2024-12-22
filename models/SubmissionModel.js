const mongoose = require('mongoose')
const config = require('../config/config')

const SubmissionSchema = new mongoose.Schema({

    submissionId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    assignmentId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId },
    courseId: { type: mongoose.Types.ObjectId },
    score: { type: Number, default: 0 },
    submissionDate: { type: Date, required: true },
    status: { type: String, default: 'SUBMITTED', enum: config.SUBMISSION_STATUS },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    url: { type: String },
    note: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Submission', SubmissionSchema)