const mongoose = require('mongoose')
const config = require('../config/config')

const ShiftSchema = new mongoose.Schema({

    shiftId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    recorderId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    assignmentId: { type: mongoose.Types.ObjectId },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    isActive: { type: Boolean, default: true }

}, { timestamps: true })


module.exports = mongoose.model('Shift', ShiftSchema)