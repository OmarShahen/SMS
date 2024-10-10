const AssignmentModel = require('../models/AssignmentModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const assignmentValidation = require('../validations/assignments')
const utils = require('../utils/utils')
const config = require('../config/config')
const GroupModel = require('../models/GroupModel')


const getUserAssignments = async (request, response) => {

    try {

        const { userId } = request.params
        let { title, groupId, academicYear, isActive, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(title) {
            searchQuery.title = { $regex: title, $options: 'i' }
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        if(groupId) {
            searchQuery.groupId = groupId
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        const assignments = await AssignmentModel.aggregate([
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
                $project: {
                    'user.password': 0,
                }
            }
        ])

        assignments.forEach(assignment => {
            assignment.user = assignment.user[0]
            assignment.group = assignment.group[0]
        })

        const totalAssignments = await AssignmentModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalAssignments,
            assignments
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

const addAssignment = async (request, response) => {

    try {

        const dataValidation = assignmentValidation.addAssignment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, groupId, title } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        const group = await GroupModel.findById(groupId)
        if(!group) {
            return response.status(400).json({
                accepted: false,
                message: 'Group ID is not registered',
                field: 'groupId'
            })
        }

        const totalTitles = await AssignmentModel.countDocuments({ groupId, title })
        if(totalTitles != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم الواجب مسجل مسبقا في هذه المجموعة',
                field: 'title'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `assignment-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const assignmentData = { assignmentId: counter.value, ...request.body, academicYear: group.academicYear }
        const assignmentObj = new AssignmentModel(assignmentData)
        const newAssignment = await assignmentObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الواجب بنجاح',
            assignment: newAssignment,
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

const updateAssignment = async (request, response) => {

    try {

        const dataValidation = assignmentValidation.updateAssignment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { assignmentId } = request.params
        const { title } = request.body

        const assignment = await AssignmentModel.findById(assignmentId)

        if(title && assignment.title != title) {
            const totalTitles = await AssignmentModel.countDocuments({ groupId: assignment.groupId, title })
            if(totalTitles != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم الواجب مسجل مسبقا في هذه المجموعة',
                    field: 'title'
                })
            } 
        }

        const updatedAssignment = await AssignmentModel
        .findByIdAndUpdate(assignmentId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الواجب بنجاح',
            assignment: updatedAssignment,
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

const updateAssignmentURL = async (request, response) => {

    try {

        const dataValidation = assignmentValidation.updateAssignmentURL(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { assignmentId } = request.params
        const { url } = request.body

        const updatedAssignment = await AssignmentModel
        .findByIdAndUpdate(assignmentId, { url }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث ملف الواجب بنجاح',
            assignment: updatedAssignment,
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

const deleteAssignment = async (request, response) => {

    try {

        const { assignmentId } = request.params

        const deletedAssignment = await AssignmentModel.findByIdAndDelete(assignmentId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الواجب بنجاح',
            assignment: deletedAssignment
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


module.exports = { getUserAssignments, addAssignment, updateAssignment, updateAssignmentURL, deleteAssignment }