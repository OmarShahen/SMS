const GroupModel = require('../models/GroupModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const AttendanceModel = require('../models/AttendanceModel')
const PaymentModel = require('../models/PaymentModel')
const CounterModel = require('../models/CounterModel')
const subscriptionValidation = require('../validations/subscriptions')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const { telegramBot } = require('../bot/telegram-bot')
const { format } = require('date-fns')
const { SUBSCRIPTION_STATUS } = require('../utils/values')


const getUserSubscriptions = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, groupId, recorderId, status, academicYear, isPaid, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(studentId) {
            searchQuery.studentId = mongoose.Types.ObjectId(studentId)
        }

        if(groupId) {
            searchQuery.groupId = mongoose.Types.ObjectId(groupId)
        }

        if(recorderId) {
            searchQuery.recorderId = mongoose.Types.ObjectId(recorderId)
        }

        if(status) {
            if(status == 'EXPIRED') {
                searchQuery.endDate = { $lt: new Date() }
            } else {
                searchQuery.status = status
            }
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        if(isPaid == 'TRUE') {
            searchQuery.isPaid = true
        } else if(isPaid == 'FALSE') {
            searchQuery.isPaid = false
        }

        const subscriptions = await SubscriptionModel.aggregate([
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
                $limit: limit
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
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
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }
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
                    from: 'payments',
                    localField: 'payments',
                    foreignField: '_id',
                    as: 'payments'
                }
            },
            {
                $project: {
                    'user.password': 0,
                    'recorder.password': 0
                }
            }
        ])

        subscriptions.forEach(subscription => {
            subscription.user = subscription.user[0]
            subscription.group = subscription.group[0]
            subscription.student = subscription.student[0]
            subscription.recorder = subscription.recorder[0]
        })

        const totalSubscriptions = await SubscriptionModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalSubscriptions,
            subscriptions
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

const addSubscription = async (request, response) => {

    try {

        const dataValidation = subscriptionValidation.addSubscription(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, studentId, groupId, recorderId, totalPrice, amountPaid, paymentMethod } = request.body

        const userPromise = UserModel.findById(userId)
        const studentPromise = StudentModel.findById(studentId)
        const groupPromise = GroupModel.findById(groupId)
        const recorderPromise = UserModel.findById(recorderId)

        const [user, student, group, recorder] = await Promise.all([
            userPromise,
            studentPromise,
            groupPromise,
            recorderPromise
        ])

        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        if(!student) {
            return response.status(400).json({
                accepted: false,
                message: 'Student ID is not registered',
                field: 'studentId'
            })
        }

        if(!group) {
            return response.status(400).json({
                accepted: false,
                message: 'Group ID is not registered',
                field: 'groupId'
            })
        }

        if(!recorder) {
            return response.status(400).json({
                accepted: false,
                message: 'Recorder ID is not registered',
                field: 'recorderId'
            })
        }

        const totalSubscriptions = await SubscriptionModel.countDocuments({ studentId, status: 'ACTIVE', endDate: { $gte: new Date() } })
        if(totalSubscriptions != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'الطالب لديه اشتراك مفعل مسبقا',
                field: 'studentId'
            })
        }

        if(amountPaid && amountPaid > totalPrice) {
            return response.status(400).json({
                accepted: false,
                message: 'المبلغ المدفوع اكثر من قيمة الاشتراك',
                field: 'amountPaid'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `subscription-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )
        
        const subscriptionData = { subscriptionId: counter.value, ...request.body }
        const subscriptionObj = new SubscriptionModel(subscriptionData)
        let newSubscription = await subscriptionObj.save()

        let newPayment

        if(amountPaid) {

            const counter = await CounterModel.findOneAndUpdate(
                { name: `payment-${userId}` },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )
    
            const paymentData = { 
                paymentId: counter.value, 
                subscriptionId: newSubscription._id,
                amount: amountPaid,
                paymentMethod: paymentMethod ? paymentMethod : 'CASH',
                ...request.body
            }
            const paymentObj = new PaymentModel(paymentData)
            newPayment = await paymentObj.save()
            
            const isPaid = amountPaid == totalPrice ? true : false

            newSubscription = await SubscriptionModel
            .findByIdAndUpdate(newSubscription._id, { isPaid, $push: { payments: newPayment._id } }, { new: true })
        }

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(studentId, { subscriptionId: newSubscription._id }, { new: true })

        const subscriptionStatus = newSubscription.status != 'CANCELLED' && newSubscription.endDate < new Date() ? 'EXPIRED' : newSubscription.status

        const message = `
        📢 تم تسجيل اشتراك جديد للطالب!

        🆔 رقم الاشتراك: ${newSubscription.subscriptionId}
        👤 الاسم: ${updatedStudent.name}
        🆔 رقم الطالب: ${updatedStudent.studentId}
        👥 المجموعة: ${group.name}
        📅 تاريخ البداية: ${newSubscription.startDate ? format(new Date(newSubscription.startDate), `yyyy-MM-dd`) : `غير مسجل`}
        📅 تاريخ النهاية: ${newSubscription.endDate ? format(new Date(newSubscription.endDate), `yyyy-MM-dd`) : `غير مسجل`}
        📌 الحالة: ${SUBSCRIPTION_STATUS[subscriptionStatus]}
        📖 عدد الحصص المسموح بها: ${newSubscription.allowedSessions}
        ✅ عدد الحصص التي تم حضورها: ${newSubscription.attendedSessions}
        💵 السعر: ${newSubscription.totalPrice} جنيه
        💵 المدفوع: ${amountPaid ? amountPaid : 0} جنيه
        🔗 رابط الاشتراك: ${config.URL}/subscriptions/${newSubscription._id}/qr-code

        نتمنى لك تجربة دراسية ناجحة! 🎓
        `

        if(updatedStudent.telegramId) {
            telegramBot.sendMessage(updatedStudent.telegramId, message)
        }

        if(updatedStudent.parentTelegramId) {
            telegramBot.sendMessage(updatedStudent.parentTelegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة اشتراك الطالب بنجاح',
            subscription: newSubscription,
            payment: newPayment,
            student: updatedStudent
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

const updateSubscriptionStatus = async (request, response) => {

    try {

        const dataValidation = subscriptionValidation.updateSubscriptionStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { subscriptionId } = request.params
        const { status } = request.body

        const subscription = await SubscriptionModel.findById(subscriptionId)

        if(subscription.status != 'ACTIVE' || new Date() > new Date(subscription.endDate)) {
            return response.status(400).json({
                accepted: false,
                message: 'لا يمكن تعديل اشتراك غير نشط',
                field: 'subscriptionId'
            })
        }

        const updatedSubscription = await SubscriptionModel
        .findByIdAndUpdate(subscriptionId, { status }, { new: true })

        const group = await GroupModel.findById(updatedSubscription.groupId)
        const targetStudent = await StudentModel.findById(updatedSubscription.studentId)

        const subscriptionStatus = updatedSubscription.status != 'CANCELLED' && updatedSubscription.endDate < new Date() ? 'EXPIRED' : updatedSubscription.status

        const message = `
        📢 تم تعديل اشتراك للطالب!

        🆔 رقم الاشتراك: ${updatedSubscription.subscriptionId}
        👤 الاسم: ${targetStudent.name}
        🆔 رقم الطالب: ${targetStudent.studentId}
        👥 المجموعة: ${group.name}
        📅 تاريخ البداية: ${updatedSubscription.startDate ? format(new Date(updatedSubscription.startDate), `yyyy-MM-dd`) : `غير مسجل`}
        📅 تاريخ النهاية: ${updatedSubscription.endDate ? format(new Date(updatedSubscription.endDate), `yyyy-MM-dd`) : `غير مسجل`}
        📌 الحالة: ${SUBSCRIPTION_STATUS[subscriptionStatus]}
        📖 عدد الحصص المسموح بها: ${updatedSubscription.allowedSessions}
        ✅ عدد الحصص التي تم حضورها: ${updatedSubscription.attendedSessions}
        💵 السعر: ${updatedSubscription.totalPrice} جنيه
        🔗 رابط الاشتراك: ${config.URL}/subscriptions/${updatedSubscription._id}/qr-code

        نتمنى لك تجربة دراسية ناجحة! 🎓
        `

        if(targetStudent.telegramId) {
            telegramBot.sendMessage(targetStudent.telegramId, message)
        }

        if(targetStudent.parentTelegramId) {
            telegramBot.sendMessage(targetStudent.parentTelegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الاشتراك بنجاح',
            subscription: updatedSubscription,
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

const deleteSubscription = async (request, response) => {

    try {

        const { subscriptionId } = request.params

        const totalAttendances = await AttendanceModel.countDocuments({ subscriptionId })
        if(totalAttendances != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك حضور مسجل في الاشتراك',
                field: 'subscriptionId'
            })
        }

        const totalPayments = await PaymentModel.countDocuments({ subscriptionId })
        if(totalPayments != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك مدفوعات مسجلة في الاشتراك',
                field: 'subscriptionId'
            })
        }

        const deletedSubscription = await SubscriptionModel.findByIdAndDelete(subscriptionId)

        const updatedStudent = await StudentModel
        .updateOne({ subscriptionId: deletedSubscription._id }, { $set: { subscriptionId: null } })

        const group = await GroupModel.findById(deletedSubscription.groupId)
        const targetStudent = await StudentModel.findById(deletedSubscription.studentId)

        const subscriptionStatus = deletedSubscription.status != 'CANCELLED' && deletedSubscription.endDate < new Date() ? 'EXPIRED' : deletedSubscription.status

        const message = `
        📢 تم مسح اشتراك للطالب!

        🆔 رقم الاشتراك: ${deletedSubscription.subscriptionId}
        👤 الاسم: ${targetStudent.name}
        🆔 رقم الطالب: ${targetStudent.studentId}
        👥 المجموعة: ${group.name}
        📅 تاريخ البداية: ${deletedSubscription.startDate ? format(new Date(deletedSubscription.startDate), `yyyy-MM-dd`) : `غير مسجل`}
        📅 تاريخ النهاية: ${deletedSubscription.endDate ? format(new Date(deletedSubscription.endDate), `yyyy-MM-dd`) : `غير مسجل`}
        📌 الحالة: ${SUBSCRIPTION_STATUS[subscriptionStatus]}
        📖 عدد الحصص المسموح بها: ${deletedSubscription.allowedSessions}
        ✅ عدد الحصص التي تم حضورها: ${deletedSubscription.attendedSessions}
        💵 السعر: ${deletedSubscription.totalPrice} جنيه
        🔗 رابط الاشتراك: ${config.URL}/subscriptions/${deletedSubscription._id}/qr-code

        نتمنى لك تجربة دراسية ناجحة! 🎓
        `

        if(targetStudent.telegramId) {
            telegramBot.sendMessage(targetStudent.telegramId, message)
        }

        if(targetStudent.parentTelegramId) {
            telegramBot.sendMessage(targetStudent.parentTelegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الاشتراك بنجاح',
            subscription: deletedSubscription,
            student: updatedStudent
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

const getSubscriptionsStats = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, groupId, recorderId, academicYear } = request.query


        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        if(studentId) {
            searchQuery.studentId = mongoose.Types.ObjectId(studentId)
        }

        if(groupId) {
            searchQuery.groupId = mongoose.Types.ObjectId(groupId)
        }

        if(recorderId) {
            searchQuery.recorderId = mongoose.Types.ObjectId(recorderId)
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        searchQuery.status = { $ne: 'CANCELLED' }        

        const totalSubscriptions = await SubscriptionModel.countDocuments(searchQuery)

        const totalPaidSubscriptions = await SubscriptionModel.countDocuments({ ...searchQuery, isPaid: true })

        const totalUnPaidSubscriptions = await SubscriptionModel.countDocuments({ ...searchQuery, isPaid: false })

        const totalExpectedPaidList = await SubscriptionModel.aggregate([
            {
                $match: { ...searchQuery }
            },
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: '$totalPrice' }
                }
            }
        ])

        const totalAmountPaidList = await SubscriptionModel.aggregate([
            {
                $match: { ...searchQuery }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payments',
                    foreignField: '_id',
                    as: 'payment'
                }
            },
            {
                $addFields: {
                  totalAmount: {
                    $sum: '$payment.amount'     
                  }
                }
            },
            {
                $project: {
                  _id: 1,
                  totalAmount: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: '$totalAmount' }
                }
            }
        ])


        const totalExpectedAmount = totalExpectedPaidList.length > 0 ? totalExpectedPaidList[0].totalPaid : 0
        const totalPaidAmount = totalAmountPaidList.length > 0 ? totalAmountPaidList[0].totalPaid : 0
        const totalUnPaidAmount = totalExpectedAmount - totalPaidAmount


        return response.status(200).json({
            accepted: true,
            totalSubscriptions,
            totalPaidSubscriptions,
            totalUnPaidSubscriptions,
            totalExpectedAmount,
            totalPaidAmount,
            totalUnPaidAmount        
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


module.exports = { getUserSubscriptions, addSubscription, updateSubscriptionStatus, deleteSubscription, getSubscriptionsStats }