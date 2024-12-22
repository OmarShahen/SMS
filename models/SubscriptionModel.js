const mongoose = require('mongoose')
const config = require('../config/config')

const SubscriptionSchema = new mongoose.Schema({

    subscriptionId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    recorderId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId },
    courseId: { type: mongoose.Types.ObjectId },
    academicYear: { type: String, required: true, enum: config.ACADEMIC_YEARS },
    status: { type: String, default: 'ACTIVE', enum: config.SUBSCRIPTION_STATUS },
    allowedSessions: { type: Number, default: 0 },
    attendedSessions: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    payments: [] 

}, { timestamps: true })


module.exports = mongoose.model('Subscription', SubscriptionSchema)