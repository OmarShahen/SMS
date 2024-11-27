const PaymentModel = require('../models/PaymentModel')
const UserModel = require('../models/UserModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const StudentModel = require('../models/StudentModel')
const CounterModel = require('../models/CounterModel')
const paymentValidation = require('../validations/payments')
const utils = require('../utils/utils')
const mongoose = require('mongoose')
const config = require('../config/config')
const { telegramBot } = require('../bot/telegram-bot')
const { format } = require('date-fns')
const { PAYMENT_METHODS } = require('../utils/values')


const calculateTotalAmountPaid = (payments) => {

    let totalPaid = 0

    for(let i=0;i<payments.length;i++) {
        const payment = payments[i]
        totalPaid += payment.amount
    }

    return totalPaid
}

const getUserPayments = async (request, response) => {

    try {

        const { userId } = request.params
        let { recorderId, studentId, subscriptionId, groupId, academicYear, isRefunded, paymentMethod, page, limit } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(recorderId) {
            searchQuery.recorderId = mongoose.Types.ObjectId(recorderId)
        }

        if(studentId) {
            searchQuery.studentId = mongoose.Types.ObjectId(studentId)
        }

        if(subscriptionId) {
            searchQuery.subscriptionId = mongoose.Types.ObjectId(subscriptionId)
        }

        if(groupId) {
            searchQuery.groupId = mongoose.Types.ObjectId(groupId)
        }

        if(paymentMethod) {
            searchQuery.paymentMethod = paymentMethod
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        if(isRefunded == 'TRUE') {
            searchQuery.isRefunded = true
        } else if(isRefunded == 'FALSE') {
            searchQuery.isRefunded = false
        }

        const payments = await PaymentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: Number.parseInt(limit)
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'recorderId',
                    foreignField: '_id',
                    as: 'recorder'
                }
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'subscriptionId',
                    foreignField: '_id',
                    as: 'subscription'
                }
            },
            {
                $lookup: {
                    from: 'groups',
                    localField: 'groupId',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'refunderId',
                    foreignField: '_id',
                    as: 'refunder'
                }
            },
            {
                $project: {
                    'recorder.password': 0,
                    'refunder.password': 0
                }
            }
        ])

        payments.forEach(payment => {
            payment.recorder = payment.recorder[0]
            payment.subscription = payment.subscription[0]
            payment.student = payment.student[0]
            payment.group = payment.group[0]
            payment.refunder = payment.refunder[0]
        })

        const totalPayments = await PaymentModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalPayments,
            payments
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

const addPayment = async (request, response) => {

    try {

        const dataValidation = paymentValidation.addPayment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, recorderId, studentId, subscriptionId, amount } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        const recorder = await UserModel.findById(recorderId)
        if(!recorder) {
            return response.status(400).json({
                accepted: false,
                message: 'Recorder ID is not registered',
                field: 'recorderId'
            })
        }

        const student = await StudentModel.findById(studentId)
        if(!student) {
            return response.status(400).json({
                accepted: false,
                message: 'Student ID is not registered',
                field: 'studentId'
            })
        }

        const subscription = await SubscriptionModel.findById(subscriptionId)
        if(!subscription) {
            return response.status(400).json({
                accepted: false,
                message: 'Subscription ID is not registered',
                field: 'subscriptionId'
            })
        }

        if(subscription.isPaid) {
            return response.status(400).json({
                accepted: false,
                message: 'الاشتراك مدفوع كاملا',
                field: 'subscriptionId'
            })
        }

        const payments = await PaymentModel.find({ subscriptionId, isRefunded: false })

        const TOTAL_PAID = calculateTotalAmountPaid(payments) + amount

        if(TOTAL_PAID > subscription.totalPrice) {
            return response.status(400).json({
                accepted: false,
                message: 'المبلغ المدفوع اكثر من قيمة الاشتراك',
                field: 'amount'
            })
        }

        const isPaid = subscription.totalPrice == TOTAL_PAID ? true : false

        const counter = await CounterModel.findOneAndUpdate(
            { name: `payment-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const paymentData = { paymentId: counter.value, ...request.body, }
        const paymentObj = new PaymentModel(paymentData)
        const newPayment = await paymentObj.save()

        const updatedSubscription = await SubscriptionModel
        .findByIdAndUpdate(subscriptionId, { isPaid, $push: { payments: newPayment._id } }, { new: true })

        const message = `
            📢 تم تسجيل عملية دفع جديدة للطالب!

            🆔 رقم العملية: ${newPayment.paymentId}
            👤 اسم الطالب: ${student.name}
            🆔 رقم الطالب: ${student.studentId}
            🆔 رقم الاشتراك: ${updatedSubscription.subscriptionId}
            💵 المبلغ: ${newPayment.amount} جنيه
            📅 تاريخ: ${format(new Date(newPayment.createdAt), `yyyy-MM-dd`)}
            💳 طريقة الدفع: ${PAYMENT_METHODS[newPayment.paymentMethod]}

            شكرًا لاختياركم لخدماتنا التعليمية! 🎓
        `

        if(student.telegramId) {
            telegramBot.sendMessage(student.telegramId, message)
        }

        if(student.parentTelegramId) {
            telegramBot.sendMessage(student.parentTelegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الدفع بنجاح',
            payment: newPayment,
            subscription: updatedSubscription
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

const deletePayment = async (request, response) => {

    try {

        const { paymentId } = request.params

        const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId)

        const updatedSubscription = await SubscriptionModel
        .findByIdAndUpdate(deletedPayment.subscriptionId, { isPaid: false, $pull: { payments: deletedPayment._id } }, { new: true })

        const student = await StudentModel.findById(deletedPayment.studentId)

        const message = `
            📢 تم مسح عملية دفع للطالب!

            🆔 رقم العملية: ${deletedPayment.paymentId}
            👤 اسم الطالب: ${student.name}
            🆔 رقم الطالب: ${student.studentId}
            🆔 رقم الاشتراك: ${updatedSubscription.subscriptionId}
            💵 المبلغ: ${deletedPayment.amount} جنيه
            📅 تاريخ: ${format(new Date(deletedPayment.createdAt), `yyyy-MM-dd`)}
            💳 طريقة الدفع: ${PAYMENT_METHODS[deletedPayment.paymentMethod]}

            شكرًا لاختياركم لخدماتنا التعليمية! 🎓
        `

        if(student.telegramId) {
            telegramBot.sendMessage(student.telegramId, message)
        }

        if(student.parentTelegramId) {
            telegramBot.sendMessage(student.parentTelegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الدفع بنجاح',
            payment: deletedPayment,
            subscription: updatedSubscription
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

const refundPayment = async (request, response) => {

    try {

        const dataValidation = paymentValidation.refundPayment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { paymentId } = request.params
        const { refunderId } = request.body

        const payment = await PaymentModel.findById(paymentId)
        if(payment.isRefunded) {
            return response.status(400).json({
                accepted: false,
                message: 'تم استرداد هذه العملية مسبقا',
                field: 'paymentId'
            })
        }

        const refunder = await UserModel.findById(refunderId)
        if(!refunder) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'refunderId'
            })
        }

        const updatedPayment = await PaymentModel
        .findByIdAndUpdate(paymentId, { isRefunded: true, refunderId, refundDate: new Date() }, { new: true })

        const updatedSubscription = await SubscriptionModel
        .findByIdAndUpdate(updatedPayment.subscriptionId, { isPaid: false, $pull: { payments: updatedPayment._id } }, { new: true })

        const student = await StudentModel.findById(updatedPayment.studentId)

        const message = `
            📢 تم استرداد عملية دفع للطالب!

            🆔 رقم العملية: ${updatedPayment.paymentId}
            👤 اسم الطالب: ${student.name}
            🆔 رقم الطالب: ${student.studentId}
            🆔 رقم الاشتراك: ${updatedSubscription.subscriptionId}
            💵 المبلغ: ${updatedPayment.amount} جنيه
            📅 تاريخ: ${format(new Date(updatedPayment.createdAt), `yyyy-MM-dd`)}
            💳 طريقة الدفع: ${PAYMENT_METHODS[updatedPayment.paymentMethod]}
            👤  الموظف: ${refunder.firstName}

            شكرًا لاختياركم لخدماتنا التعليمية! 🎓
        `

        if(student.telegramId) {
            telegramBot.sendMessage(student.telegramId, message)
        }

        if(student.parentTelegramId) {
            telegramBot.sendMessage(student.parentTelegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم استرداد الدفع بنجاح',
            payment: updatedPayment,
            subscription: updatedSubscription
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

const getUserPaymentsStats = async (request, response) => {

    try {

        const { userId } = request.params
        let { recorderId, studentId, groupId, academicYear, paymentMethod } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        if(recorderId) {
            searchQuery.recorderId = mongoose.Types.ObjectId(recorderId)
        }

        if(studentId) {
            searchQuery.studentId = mongoose.Types.ObjectId(studentId)
        }

        if(groupId) {
            searchQuery.groupId = mongoose.Types.ObjectId(groupId)
        }

        if(paymentMethod) {
            searchQuery.paymentMethod = paymentMethod
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        const total = await PaymentModel.countDocuments(searchQuery)
        const totalPaid = await PaymentModel.countDocuments({ ...searchQuery, isRefunded: false })
        const totalRefunded = await PaymentModel.countDocuments({ ...searchQuery, isRefunded: true })

        const amountPaidList = await PaymentModel.aggregate([
            {
                $match: { ...searchQuery, isRefunded: false }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])

        const amountRefundedList = await PaymentModel.aggregate([
            {
                $match: { ...searchQuery, isRefunded: true }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])

        const amountPaid = amountPaidList.length > 0 ? amountPaidList[0].totalAmount : 0
        const amountRefunded = amountRefundedList.length > 0 ? amountRefundedList[0].totalAmount : 0

        return response.status(200).json({
            accepted: true,
            total,
            totalPaid,
            totalRefunded,
            amountPaid,
            amountRefunded
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
    getUserPayments, 
    addPayment,
    deletePayment,
    refundPayment,
    getUserPaymentsStats
}