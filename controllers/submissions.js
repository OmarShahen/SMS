const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const submissionValidation = require('../validations/submissions')
const utils = require('../utils/utils')
const config = require('../config/config')
const SubmissionModel = require('../models/SubmissionModel')
const AssignmentModel = require('../models/AssignmentModel')
const CounterModel = require('../models/CounterModel')
const mongoose = require('mongoose')


const getUserSubmissions = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, groupId, assignmentId, status, academicYear, limit, page } = request.query

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

        if(assignmentId) {
            searchQuery.assignmentId = mongoose.Types.ObjectId(assignmentId)
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        if(status) {
            searchQuery.status = status
        }

        const submissions = await SubmissionModel.aggregate([
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
                    from: 'assignments',
                    localField: 'assignmentId',
                    foreignField: '_id',
                    as: 'assignment'
                }
            },
            {
                $project: {
                    'user.password': 0,
                }
            }
        ])

        submissions.forEach(submission => {
            submission.user = submission.user[0]
            submission.group = submission.group[0]
            submission.student = submission.student[0]
            submission.assignment = submission.assignment[0]
        })

        const totalSubmissions = await SubmissionModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalSubmissions,
            submissions
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

const getStudentsThatSubmittedAssignment = async (request, response) => {

    try {

        const { assignmentId } = request.params

        const submissions = await SubmissionModel
        .find({ assignmentId })
        .select('studentId status')

        return response.status(200).json({
            accepted: true,
            students: submissions
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


const addSubmission = async (request, response) => {

    try {

        const dataValidation = submissionValidation.addSubmission(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, studentId, assignmentId, status } = request.body

        const userPromise = UserModel.findById(userId)
        const studentPromise = StudentModel.findById(studentId)
        const assignmentPromise = AssignmentModel.findById(assignmentId)

        const [user, student, assignment] = await Promise.all([
            userPromise,
            studentPromise,
            assignmentPromise,
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

        if(!assignment) {
            return response.status(400).json({
                accepted: false,
                message: 'Assignment ID is not registered',
                field: 'assignmentId'
            })
        }

        const totalSubmisisons = await SubmissionModel.countDocuments({ studentId, assignmentId })
        if(totalSubmisisons != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'الطالب لدية تسليم مسجل للواجب',
                field: 'assignmentId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `submission-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const submissionData = {
            submissionId: counter.value,
            ...request.body, 
            groupId: student.groupId,
            academicYear: student.academicYear,
        }
        const submissionObj = new SubmissionModel(submissionData)
        const newSubmission = await submissionObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة استلام الواجب بنجاح',
            submission: newSubmission
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

const updateSubmissionStatusByStudentIdAndAssignmentId = async (request, response) => {

    try {

        const dataValidation = submissionValidation.updateSubmissionStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { studentId, assignmentId } = request.params
        const { status } = request.body

        const updatedSubmission = await SubmissionModel
        .updateOne({ studentId, assignmentId }, { $set: { status } })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الحضور بنجاح',
            submission: updatedSubmission,
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

const updateSubmission = async (request, response) => {

    try {

        const dataValidation = submissionValidation.updateSubmission(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { submissionId } = request.params

        const updatedSubmission = await SubmissionModel
        .findByIdAndUpdate(submissionId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث تسليم الواجب بنجاح',
            submission: updatedSubmission,
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

const updateSubmissionURL = async (request, response) => {

    try {

        const dataValidation = submissionValidation.updateSubmissionURL(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { submissionId } = request.params
        const { url } = request.body

        const updatedSubmission = await SubmissionModel
        .findByIdAndUpdate(submissionId, { url }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث ملف الواجب المستلم بنجاح',
            submission: updatedSubmission,
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

const deleteSubmission = async (request, response) => {

    try {

        const { submissionId } = request.params

        const deletedSubmission = await SubmissionModel.findByIdAndDelete(submissionId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح استلام الواجب بنجاح',
            submission: deletedSubmission,
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
    getUserSubmissions, 
    getStudentsThatSubmittedAssignment, 
    addSubmission, 
    updateSubmission, 
    updateSubmissionStatusByStudentIdAndAssignmentId,
    updateSubmissionURL, 
    deleteSubmission 
}