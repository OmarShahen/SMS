const mongoose = require('mongoose')
const config = require('../config/config')

const AttendanceSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    shiftId: { type: mongoose.Types.ObjectId },
    teacherId: { type: mongoose.Types.ObjectId },
    courseId: { type: mongoose.Types.ObjectId },
    subscriptionId: { type: mongoose.Types.ObjectId, required: true },
    recorderId: { type: mongoose.Types.ObjectId, required: true },
    status: { type: String, required: true, enum: config.ATTENDANCE_STATUS },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    note: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Attendance', AttendanceSchema)