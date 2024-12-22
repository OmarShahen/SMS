const mongoose = require('mongoose')
const config = require('../config/config')

const SpecializationSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },

}, { timestamps: true })


module.exports = mongoose.model('Specialization', SpecializationSchema)