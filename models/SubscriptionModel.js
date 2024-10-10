const mongoose = require('mongoose')
const config = require('../config/config')

const SubscriptionSchema = new mongoose.Schema({

    subscriptionId: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    groupId: { type: mongoose.Types.ObjectId, required: true },
    recorderId: { type: mongoose.Types.ObjectId, required: true },
    status: { type: String, default: 'ACTIVE', enum: config.SUBSCRIPTION_STATUS },
    allowedSessions: { type: Number, default: 0 },
    attendedSessions: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date }

}, { timestamps: true })


module.exports = mongoose.model('Subscription', SubscriptionSchema)