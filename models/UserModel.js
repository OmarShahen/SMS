const mongoose = require('mongoose')
const config = require('../config/config')

const UserSchema = new mongoose.Schema({

    userId: { type: Number, required: true, unique: true },
    ownerId: { type: mongoose.Types.ObjectId },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    sessionPrice: { type: Number, required: true, default: 0 },
    lang: { type: String, default: 'ar', enum: config.LANGUAGES },
    academicType: { type: String, default: 'ALL', enum: config.ACADEMIC_TYPES },
    organizationType: { type: String, default: 'TEACHER', enum: config.ORGANIZATION_TYPES },

    oauth: {
        isGoogleAuth: { type: Boolean, default: false }
    },

    type: { type: String, required: true, enum: config.TYPES },

    isVerified: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, default: false },
    lastLoginDate: { type: Date },

    resetPassword: {
        verificationCode: { type: Number },
        expirationDate: { type: Date }
    },
    deleteAccount: {
        verificationCode: { type: Number },
        expirationDate: { type: Date }
    },

    modules: {
        students: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        groups: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        subscriptions: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        payments: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        shifts: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        attendances: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        exams: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        grades: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        assignments: { 
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        specializations: {
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        teachers: {
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        },
        courses: {
            isCreate: { type: Boolean, default: true },
            isRead: { type: Boolean, default: true },
            isUpdate: { type: Boolean, default: true },
            isDelete: { type: Boolean, default: true }
        }
    },


}, { timestamps: true })


module.exports = mongoose.model('User', UserSchema)