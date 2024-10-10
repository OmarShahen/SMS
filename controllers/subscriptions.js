const GroupModel = require('../models/GroupModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const CounterModel = require('../models/CounterModel')
const subscriptionValidation = require('../validations/subscriptions')
const utils = require('../utils/utils')
const config = require('../config/config')


const getUserSubscriptions = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, groupId, recorderId, status, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(studentId) {
            searchQuery.studentId = studentId
        }

        if(groupId) {
            searchQuery.groupId = groupId
        }

        if(recorderId) {
            searchQuery.recorderId = recorderId
        }

        if(status) {
            searchQuery.status = status
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

        const { userId, studentId, groupId, recorderId } = request.body

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

        const counter = await CounterModel.findOneAndUpdate(
            { name: `subscription-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const subscriptionData = { subscriptionId: counter.value, ...request.body }
        const subscriptionObj = new SubscriptionModel(subscriptionData)
        const newSubscription = await subscriptionObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة اشتراك الطالب بنجاح',
            subscription: newSubscription,
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

        const deletedSubscription = await SubscriptionModel.findByIdAndDelete(subscriptionId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الاشتراك بنجاح',
            subscription: deletedSubscription
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


module.exports = { getUserSubscriptions, addSubscription, updateSubscriptionStatus, deleteSubscription }