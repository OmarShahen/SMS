const GroupModel = require('../models/GroupModel')
const ShiftModel = require('../models/ShiftModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const shiftValidation = require('../validations/shifts')
const utils = require('../utils/utils')
const config = require('../config/config')


const getUserShifts = async (request, response) => {

    try {

        const { userId } = request.params
        let { recorderId, groupId, isActive, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(recorderId) {
            searchQuery.recorderId = recorderId
        }

        if(groupId) {
            searchQuery.groupId = groupId
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        const shifts = await ShiftModel.aggregate([
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

        shifts.forEach(shift => {
            shift.user = shift.user[0]
            shift.recorder = shift.recorder[0]
            shift.group = shift.group[0]
        })

        const totalShifts = await ShiftModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalShifts,
            shifts
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


const addShift = async (request, response) => {

    try {

        const dataValidation = shiftValidation.addShift(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, recorderId, groupId } = request.body

        const userPromise = UserModel.findById(userId)
        const recorderPromise = UserModel.findById(recorderId)
        const groupPromise = GroupModel.findById(groupId)

        const [user, recorder, group] = await Promise.all([
            userPromise,
            recorderPromise,
            groupPromise
        ])

        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        if(!recorder) {
            return response.status(400).json({
                accepted: false,
                message: 'Recorder ID is not registered',
                field: 'recorderId'
            })
        }

        if(!group) {
            return response.status(400).json({
                accepted: false,
                message: 'Group ID is not registered',
                field: 'groupId'
            })
        }

        const totalActiveShifts = await ShiftModel.countDocuments({ groupId, isActive: true })
        if(totalActiveShifts != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'التسجيل مفتوح مسبقا في هذه المجموعة',
                field: 'groupId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `shift-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const shiftData = { shiftId: counter.value, ...request.body }
        const shiftObj = new ShiftModel(shiftData)
        const newShift = await shiftObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم فتح تسجيل المجموعة بنجاح',
            shift: newShift,
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

const deleteShift = async (request, response) => {

    try {

        const { shiftId } = request.params

        const deletedShift = await ShiftModel.findByIdAndDelete(shiftId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح تسجيل الحضور بنجاح',
            shift: deletedShift
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


const closeShift = async (request, response) => {

    try {

        const { shiftId } = request.params

        const shift = await ShiftModel.findById(shiftId)
        if(!shift.isActive) {
            return response.status(400).json({
                accepted: false,
                message: 'تسجيل الحضور مغلق مسبقا',
                field: 'shiftId'
            })
        }

        const updatedShift = await ShiftModel
        .findByIdAndUpdate(shiftId, { isActive: false, endTime: new Date() }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم غلق تسجيل الحضور بنجاح',
            shift: updatedShift,
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


module.exports = { getUserShifts, addShift, closeShift, deleteShift }