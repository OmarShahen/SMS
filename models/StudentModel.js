const mongoose = require('mongoose')
const config = require('../config/config')

const StudentSchema = new mongoose.Schema({

    studentId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    courseId: { type: mongoose.Types.ObjectId },
    subscriptionId: { type: mongoose.Types.ObjectId, default: null },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    parentPhone: { type: String },
    gender: { type: String, required: true, enum: config.GENDER },
    birthDate: { type: Date },
    isActive: { type: Boolean, default: true },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    address: { type: String },
    referredBy: { type: String, enum: config.REFER_METHODS },
    telegramId: { type: String, default: null },
    parentTelegramId: { type: String, default: null },
    QRCodeUUID: { type: String },

}, { timestamps: true })

module.exports = mongoose.model('Student', StudentSchema)