const mongoose = require('mongoose')

const GradeSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    examId: { type: mongoose.Types.ObjectId, required: true },
    correctorId: { type: mongoose.Types.ObjectId, required: true },
    score: { type: Number, required: true, default: 0 },
    note: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Grade', GradeSchema)