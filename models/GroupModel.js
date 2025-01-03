const mongoose = require('mongoose')
const config = require('../config/config')

const GroupSchema = new mongoose.Schema({

    groupId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId },
    courseId: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isFull: { type: Boolean, default: false },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    supportPhone: { type: String },
    description: { type: String },
    capacity: { type: Number, default: 0 },
    address: { type: String },
    addressLink: { type: String },
    whatsappLink: { type: String },
    schedule: []

}, { timestamps: true })

module.exports = mongoose.model('Group', GroupSchema)