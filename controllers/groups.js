const GroupModel = require('../models/GroupModel')
const GradeModel = require('../models/GradeModel')
const StudentModel = require('../models/StudentModel')
const ExamModel = require('../models/ExamModel')
const CounterModel = require('../models/CounterModel')
const groupValidation = require('../validations/groups')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const UserModel = require('../models/UserModel')


const getUserGroups = async (request, response) => {

    try {

        const { userId } = request.params
        let { name, isActive, isFull, academicYear, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit


        if(name) {
            searchQuery.name = { $regex: name, $options: 'i' }
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        if(isFull == 'TRUE') {
            searchQuery.isFull = true
        } else if(isFull == 'FALSE') {
            searchQuery.isFull = false
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        const groups = await GroupModel.aggregate([
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
                $project: {
                    'user.password': 0,
                }
            }
        ])

        groups.forEach(group => {
            group.user = group.user[0]
        })

        const totalGroups = await GroupModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalGroups,
            groups
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

const addGroup = async (request, response) => {

    try {

        const dataValidation = groupValidation.addGroup(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, name, academicYear } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }


        const totalNames = await GroupModel.countDocuments({ userId, name, academicYear })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم المجموعة مسجل مسبقا في هذه السنة',
                field: 'name'
            })
        }


        const counter = await CounterModel.findOneAndUpdate(
            { name: `group-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const groupData = { groupId: counter.value, ...request.body }
        const groupObj = new GroupModel(groupData)
        const newGroup = await groupObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة المجموعة بنجاح',
            group: newGroup,
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

const updateGroup = async (request, response) => {

    try {

        const dataValidation = groupValidation.updateGroup(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { groupId } = request.params
        const { name } = request.body

        const group = await GroupModel.findById(groupId)

        if(name && group.name != name) {
            const totalNames = await GroupModel.countDocuments({ userId: group.userId, name, academicYear: group.academicYear })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم المجموعة مسجل مسبقا في هذه السنة',
                    field: 'name'
                })
            } 
        }

        const updatedGroup = await GroupModel
        .findByIdAndUpdate(groupId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث المجموعة بنجاح',
            group: updatedGroup,
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

const deleteGroup = async (request, response) => {

    try {

        const { groupId } = request.params

        const totalGrades = await GradeModel.countDocuments({ groupId })
        if(totalGrades != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك درجات مسجلة في هذا المجموعة',
                field: 'groupId'
            })
        }

        const totalStudents = await StudentModel.countDocuments({ groupId })
        if(totalStudents != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك طلاب مسجلين في هذا المجموعة',
                field: 'groupId'
            })
        }

        const totalExams = await ExamModel.countDocuments({ groups: { $in: [mongoose.Types.ObjectId(groupId)] } })
        if(totalExams != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك اختبارات مسجلة في هذا المجموعة',
                field: 'groupId'
            })
        }

        const deletedGroup = await GroupModel.findByIdAndDelete(groupId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح المجموعة بنجاح',
            group: deletedGroup
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


module.exports = { getUserGroups, addGroup, updateGroup, deleteGroup }