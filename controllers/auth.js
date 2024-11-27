const config = require('../config/config')
const authValidation = require('../validations/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const EmailVerificationModel = require('../models/EmailVerificationModel')
const { generateVerificationCode } = require('../utils/random-number')
const utils = require('../utils/utils')
const { sendForgotPasswordVerificationCode } = require('../mails/forgot-password')
const { sendDeleteAccountCode } = require('../mails/delete-account')
const translations = require('../i18n/index')
const { sendVerificationCode } = require('../mails/verification-code')
const axios = require('axios')


const userLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.login(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const userList = await UserModel
        .find({ email, isVerified: true })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'البريد غير مسجل',
                field: 'email'
            })
        }

        const user = userList[0]

        if(user.isBlocked) {
            return response.status(400).json({
                accepted: false,
                message: 'الحساب محظور',
                field: 'email'
            })
        }

        if(!bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: 'كلمة السر خاطئة',
                field: 'password'
            })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(user._id, { lastLoginDate: new Date() }, { new: true })

        updatedUser.password = undefined

        const token = jwt.sign(user._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            token: token,
            user: updatedUser,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const userSignup = async (request, response) => {

    try {

        const dataValidation = authValidation.userSignup(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Email is already registered'],
                field: 'email'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'user' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const userPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)
        let userData = { ...request.body, userId: counter.value, password: userPassword, type: 'OWNER' }
        userData._id = undefined

        const userObj = new UserModel(userData)
        const newUser = await userObj.save()

        const verificationCode = generateVerificationCode()
        const mailData = await sendVerificationCode({ receiverEmail: email, verificationCode })

        const emailVerificationData = { userId: newUser._id, code: verificationCode }
        const emailVerificationObj = new EmailVerificationModel(emailVerificationData)
        const newEmailVerification = await emailVerificationObj.save()

        newUser.password = undefined

        return response.status(200).json({
            accepted: true,
            mailSuccess: mailData.isSent,
            message: mailData.isSent ? 'Verification code is sent successfully!' : 'There was a problem sending your email',
            user: newUser,
            emailVerification: newEmailVerification
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const userGoogleLogin = async (request, response) => {

    try {

        const { accessToken } = request.query

        const googleResponse = await axios
        .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`)

        const { email } = googleResponse.data

        const userList = await UserModel
        .find({ email, isVerified: true })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Email is not registered',
                field: 'email'
            })
        }

        const user = userList[0]

        if(user.isBlocked) {
            return response.status(400).json({
                accepted: false,
                message: 'Your account is blocked',
                field: 'email'
            })
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(user._id, { lastLoginDate: new Date() }, { new: true })

        updatedUser.password = undefined

        const token = jwt.sign(user._doc, config.SECRET_KEY, { expiresIn: '365d' })

        return response.status(200).json({
            accepted: true,
            user: updatedUser,
            token
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


const verifyEmailVerificationCode = async (request, response) => {

    try {

        const { userId, verificationCode } = request.params

        const emailVerificationList = await EmailVerificationModel.find({ userId, code: verificationCode })
        if(emailVerificationList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'لا يوجد رمز تحقق مسجل',
                field: 'code'
            })
        }

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(userId, { isVerified: true },{ new: true })

        const deleteCodesPromise = EmailVerificationModel.deleteMany({ userId })

        const [updatedUser, deleteCodes] = await Promise.all([updatedUserPromise, deleteCodesPromise])

        updatedUser.password = undefined

        const token = jwt.sign(updatedUser._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            message: 'تم تفعيل الحساب بنجاح!',
            user: updatedUser,
            deletedCodes: deleteCodes.deletedCount,
            token
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyEmail = async (request, response) => {

    try {

        const { email } = request.params

        if(!utils.isEmailValid(email)) {
            return response.status(400).json({
                accepted: false,
                message: 'email format is invalid',
                field: 'email'
            })
        }

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'email is already registered',
                field: 'email'
            })
        }

        return response.status(200).json({
            accepted: true,
            email
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const setUserVerified = async (request, response) => {

    try {

        const { userId } = request.params

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { isVerified: true }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'account verified successfully!',
            user: updatedUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const addUserEmailVerificationCode = async (request, response) => {

    try {

        const { userId } = request.params

        if(!utils.isObjectId(userId)) {
            return response.status(400).json({
                accepted: false,
                message: 'user Id format is invalid',
                field: 'userId'
            })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'user Id does not exist',
                field: 'userId'
            })
        }

        if(user.isVerified) {
            return response.status(400).json({
                accepted: false,
                message: 'user account is already verified',
                field: 'userId'
            })
        }

        const verificationCode = generateVerificationCode()
        const mailData = await sendVerificationCode({ receiverEmail: user.email, verificationCode })

        const emailVerificationData = { userId, code: verificationCode }
        const emailVerificationObj = new EmailVerificationModel(emailVerificationData)
        const newEmailverification = await emailVerificationObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'email verification code created successfully!',
            emailVerification: newEmailverification,
            mailData
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


const forgotPassword = async (request, response) => {

    try {

        const dataValidation = authValidation.forgotPassword(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email } = request.body

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Email is not registered'],
                field: 'email'
            })
        }

        const user = emailList[0]
        const verificationCode = generateVerificationCode()
        const verificationData = {
            resetPassword: {
                verificationCode: verificationCode,
                expirationDate: Date.now() + 3600000 // 1 hour
            }   
        }

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(user._id, verificationData, { new: true })

        const forgotPasswordData = { receiverEmail: email, verificationCode }
        const sendEmailPromise = sendForgotPasswordVerificationCode(forgotPasswordData)

        const [updatedUser, sendEmail] = await Promise.all([
            updatedUserPromise,
            sendEmailPromise
        ])

        if(!sendEmail.isSent) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['There was a problem sending your email'],
                field: 'isSent'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'Verification code is sent successfully!',
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const sendUserDeleteAccountVerificationCode = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel.findById(userId)

        if(!user.roles.includes('STAFF')) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Your account is with a role that cannot be deleted'],
                field: 'userId'
            })
        }

        const invoices = await InvoiceModel.find({ creatorId: userId })
        if(invoices.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Data registered with the account',
                field: 'userId'
            })
        }

        const verificationCode = generateVerificationCode()
        const verificationData = {
            deleteAccount: {
                verificationCode: verificationCode,
                expirationDate: Date.now() + 3600000 // 1 hour
            }   
        }

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(user._id, verificationData, { new: true })

        const deleteAccountData = { receiverEmail: user.email, verificationCode }
        const sendEmailPromise = sendDeleteAccountCode(deleteAccountData)

        const [updatedUser, sendEmail] = await Promise.all([
            updatedUserPromise,
            sendEmailPromise
        ])

        if(!sendEmail.isSent) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['There was a problem sending your email'],
                field: 'isSent'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'Verification code is sent successfully!',
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyDeleteAccountVerificationCode = async (request, response) => {

    try {

        const { userId, verificationCode } = request.params

        const userList = await UserModel
        .find({ 
            _id: userId, 
            isVerified: true, 
            'deleteAccount.verificationCode': verificationCode, 
            'deleteAccount.expirationDate': { $gt: Date.now() } 
        })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Verification code is not registered'],
                field: 'verificationCode'
            })
        }

        const user = userList[0]

        if(user.roles.includes('STAFF')) {
            const deleteClinicRequests = await ClinicRequestModel.deleteMany({ userId })
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId)

        return response.status(200).json({
            accepted: true,
            message: 'User account is deleted successfully!',
            user: deletedUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyResetPasswordVerificationCode = async (request, response) => {

    try {

        const dataValidation = authValidation.verifyResetPasswordVerificationCode(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, verificationCode } = request.body

        const userList = await UserModel
        .find({ 
            email, 
            isVerified: true, 
            'resetPassword.verificationCode': verificationCode, 
            'resetPassword.expirationDate': { $gt: Date.now() } 
        })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Verification code is not registered'],
                field: 'verificationCode'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'verification code is verified!',
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const resetPassword = async (request, response) => {

    try {

        const dataValidation = authValidation.resetPassword(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, verificationCode, password } = request.body

        const userList = await UserModel
        .find({ 
            email, 
            isVerified: true, 
            'resetPassword.verificationCode': verificationCode, 
            'resetPassword.expirationDate': { $gt: Date.now() } 
        })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Verification code is not registered'],
                field: 'verificationCode'
            })
        }

        const user = userList[0]
        const userId = user._id

        if(bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Enter a new password to the current one'],
                field: 'password'
            })
        }

        const newUserPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)


        const updateUserData = {
            password: newUserPassword,
            resetPassword: { verificationCode: null, expirationDate: null }
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, updateUserData, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user password successfully!'],
            user: updatedUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = {
    userLogin,
    userSignup,
    userGoogleLogin,
    verifyEmailVerificationCode,
    verifyEmail,
    setUserVerified,
    addUserEmailVerificationCode,
    forgotPassword,
    resetPassword,
    verifyResetPasswordVerificationCode,
    sendUserDeleteAccountVerificationCode,
    verifyDeleteAccountVerificationCode
}