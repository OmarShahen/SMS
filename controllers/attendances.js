const AttendanceModel = require('../models/AttendanceModel')
const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const attendanceValidation = require('../validations/attendances')
const utils = require('../utils/utils')
const config = require('../config/config')
const ShiftModel = require('../models/ShiftModel')
const SubscriptionModel = require('../models/SubscriptionModel')


const getUserAttendances = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, groupId, shiftId, subscriptionId, recorderId, status, limit, page } = request.query

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

        if(shiftId) {
            searchQuery.shiftId = shiftId
        }

        if(subscriptionId) {
            searchQuery.subscriptionId = subscriptionId
        }

        if(recorderId) {
            searchQuery.recorderId = recorderId
        }

        if(status) {
            searchQuery.status = status
        }

        const attendances = await AttendanceModel.aggregate([
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
                    from: 'shifts',
                    localField: 'shiftId',
                    foreignField: '_id',
                    as: 'shift'
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

        attendances.forEach(attendance => {
            attendance.user = attendance.user[0]
            attendance.group = attendance.group[0]
            attendance.student = attendance.student[0]
            attendance.shift = attendance.shift[0]
            attendance.subscription = attendance.subscription[0]
            attendance.recorder = attendance.recorder[0]
        })

        const totalAttendances = await AttendanceModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalAttendances,
            attendances
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


const addAttendance = async (request, response) => {

    try {

        const dataValidation = attendanceValidation.addAttendance(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, studentId, recorderId, shiftId } = request.body

        const userPromise = UserModel.findById(userId)
        const studentPromise = StudentModel.findById(studentId)
        const shiftPromise = ShiftModel.findById(shiftId)
        const recorderPromise = UserModel.findById(recorderId)

        const [user, student, shift, recorder] = await Promise.all([
            userPromise,
            studentPromise,
            shiftPromise,
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

        if(!shift) {
            return response.status(400).json({
                accepted: false,
                message: 'Shift ID is not registered',
                field: 'shiftId'
            })
        }

        if(!recorder) {
            return response.status(400).json({
                accepted: false,
                message: 'Recorder ID is not registered',
                field: 'recorderId'
            })
        }

        const totalActiveSubscriptionsList = await SubscriptionModel.find({ studentId, status: 'ACTIVE', endDate: { $gte: new Date() } })
        if(totalActiveSubscriptionsList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'الطالب ليس لديه اشتراك لتسجيل الحضور',
                field: 'studentId'
            })
        }

        const activeSubscription = totalActiveSubscriptionsList[0]

        if(activeSubscription.attendedSessions >= activeSubscription.allowedSessions) {
            return response.status(400).json({
                accepted: false,
                message: 'تم حضور كل الحصص المتاحة في الاشتراك',
                field: 'subscriptionId'
            })
        }

        const totalActiveShiftList = await ShiftModel.find({ groupId: student.groupId, isActive: true })
        if(totalActiveShiftList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'تسجيل الحضور مغلق',
                field: 'shiftId'
            })
        }

        const activeShift = totalActiveShiftList[0]

        const attendanceData = {
            ...request.body, 
            groupId: student.groupId, 
            subscriptionId: activeSubscription._id, 
            shiftId: activeShift._id 
        }
        const attendanceObj = new AttendanceModel(attendanceData)
        const newAttendance = await attendanceObj.save()

        const updateSubscriptionData = (activeSubscription.attendedSessions + 1) == activeSubscription.allowedSessions ?
        { $inc: { attendedSessions: 1 }, status: 'EXPIRED' }
        :
        { $inc: { attendedSessions: 1 } }

        const updatedSubscription = await SubscriptionModel
        .findByIdAndUpdate(activeSubscription._id, updateSubscriptionData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الحضور بنجاح',
            attendance: newAttendance,
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


const updateAttendanceStatus = async (request, response) => {

    try {

        const dataValidation = attendanceValidation.updateAttendanceStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { attendanceId } = request.params
        const { status } = request.body

        const attendance = await AttendanceModel.findById(attendanceId)
        const shift = await ShiftModel.findById(attendance.shiftId)

        if(!shift.isActive) {
            return response.status(400).json({
                accepted: false,
                message: 'لا يمكن تعديل الحضور بعد اغلاق التسجيل',
                field: 'attendanceId'
            })
        }

        const updatedAttendance = await AttendanceModel
        .findByIdAndUpdate(attendanceId, { status }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الحضور بنجاح',
            attendance: updatedAttendance,
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


const deleteAttendance = async (request, response) => {

    try {

        const { attendanceId } = request.params

        const attendance = await AttendanceModel.findById(attendanceId)

        const subscription = await SubscriptionModel.findById(attendance.subscriptionId)

        const updateSubscriptionData = { $inc: { attendedSessions: -1 } }

        if(new Date(subscription.endDate) < new Date()) {
            return response.status(400).json({
                accepted: false,
                message: 'لا يمكن المسح بعد انتهاء تاريخ الاشتراك',
                field: 'attendanceId'
            })
        }

        if(subscription.attendedSessions == subscription.allowedSessions) {
            updateSubscriptionData.status = 'ACTIVE'
        }

        const deletedAttendance = await AttendanceModel.findByIdAndDelete(attendanceId)

        const updatedSubscription = await SubscriptionModel
        .findByIdAndUpdate(attendance.subscriptionId, updateSubscriptionData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الحضور بنجاح',
            attendance: deletedAttendance,
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


module.exports = { getUserAttendances, addAttendance, updateAttendanceStatus, deleteAttendance }