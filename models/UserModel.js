const mongoose = require('mongoose')
const config = require('../config/config')

const UserSchema = new mongoose.Schema({

    userId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: Number },
    phone: { type: Number },
    password: { type: String },
    lang: { type: String, default: 'ar', enum: config.LANGUAGES },
    timeZone: { type: String, default: "Africa/Cairo" },
    profileImageURL: { type: String },

    oauth: {
        isGoogleAuth: { type: Boolean, default: false }
    },

    roles: [],
    type: { type: String, required: true, enum: config.TYPES },

    isEmployee: { type: Boolean, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    isShow: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    lastLoginDate: { type: Date },

    resetPassword: {
        verificationCode: { type: Number },
        expirationDate: { type: Date }
    },
    deleteAccount: {
        verificationCode: { type: Number },
        expirationDate: { type: Date }
    }

}, { timestamps: true })


module.exports = mongoose.model('User', UserSchema)