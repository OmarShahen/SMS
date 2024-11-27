const mongoose = require('mongoose')
const config = require('../config/config')

const PaymentSchema = new mongoose.Schema({

    paymentId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    recorderId: { type: mongoose.Types.ObjectId, required: true },
    subscriptionId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    amount: { type: Number, required: true },
    isRefunded: { type: Boolean, default: false },
    refunderId: { type: mongoose.Types.ObjectId },
    refundDate: { type: Date },
    paymentMethod: { type: String, required: true, enum: config.PAYMENT_METHODS }

}, { timestamps: true })

module.exports = mongoose.model('Payment', PaymentSchema)