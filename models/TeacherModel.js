const mongoose = require('mongoose')
const config = require('../config/config')

const TeacherSchema = new mongoose.Schema({

    teacherId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    specializationId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true, enum: config.TEACHER_TITLES },
    phone: { type: String },

}, { timestamps: true })

module.exports = mongoose.model('Teacher', TeacherSchema)
