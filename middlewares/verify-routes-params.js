const utils = require('../utils/utils')
const UserModel = require('../models/UserModel')
const GroupModel = require('../models/GroupModel')
const StudentModel = require('../models/StudentModel')
const ExamModel = require('../models/ExamModel')
const GradeModel = require('../models/GradeModel')
const ShiftModel = require('../models/ShiftModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const AttendanceModel = require('../models/AttendanceModel')
const AssignmentModel = require('../models/AssignmentModel')
const SubmissionModel = require('../models/SubmissionModel')
const PaymentModel = require('../models/PaymentModel')
const SpecializationModel = require('../models/SpecializationModel')
const TeacherModel = require('../models/TeacherModel')
const CourseModel = require('../models/CourseModel')


const verifyUserId = async (request, response, next) => {

    try {

        const { userId } = request.params

        if(!utils.isObjectId(userId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid user Id formate',
                field: 'userId'
            })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(404).json({
                accepted: false,
                message: 'user Id does not exist',
                field: 'userId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyGroupId = async (request, response, next) => {

    try {

        const { groupId } = request.params

        if(!utils.isObjectId(groupId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid group ID format',
                field: 'groupId'
            })
        }

        const group = await GroupModel.findById(groupId)
        if(!group) {
            return response.status(404).json({
                accepted: false,
                message: 'Group ID does not exist',
                field: 'groupId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyStudentId = async (request, response, next) => {

    try {

        const { studentId } = request.params

        if(!utils.isObjectId(studentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid student ID format',
                field: 'studentId'
            })
        }

        const student = await StudentModel.findById(studentId)
        if(!student) {
            return response.status(404).json({
                accepted: false,
                message: 'Student ID does not exist',
                field: 'studentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyExamId = async (request, response, next) => {

    try {

        const { examId } = request.params

        if(!utils.isObjectId(examId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid exam ID format',
                field: 'examId'
            })
        }

        const exam = await ExamModel.findById(examId)
        if(!exam) {
            return response.status(404).json({
                accepted: false,
                message: 'Exam ID does not exist',
                field: 'examId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyGradeId = async (request, response, next) => {

    try {

        const { gradeId } = request.params

        if(!utils.isObjectId(gradeId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid grade ID format',
                field: 'gradeId'
            })
        }

        const grade = await GradeModel.findById(gradeId)
        if(!grade) {
            return response.status(404).json({
                accepted: false,
                message: 'Grade ID does not exist',
                field: 'gradeId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyShiftId = async (request, response, next) => {

    try {

        const { shiftId } = request.params

        if(!utils.isObjectId(shiftId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid shift ID format',
                field: 'shiftId'
            })
        }

        const shift = await ShiftModel.findById(shiftId)
        if(!shift) {
            return response.status(404).json({
                accepted: false,
                message: 'Shift ID does not exist',
                field: 'shiftId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifySubscriptionId = async (request, response, next) => {

    try {

        const { subscriptionId } = request.params

        if(!utils.isObjectId(subscriptionId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid subscription ID format',
                field: 'subscriptionId'
            })
        }

        const subscription = await SubscriptionModel.findById(subscriptionId)
        if(!subscription) {
            return response.status(404).json({
                accepted: false,
                message: 'Subscription ID does not exist',
                field: 'subscriptionId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyAttendanceId = async (request, response, next) => {

    try {

        const { attendanceId } = request.params

        if(!utils.isObjectId(attendanceId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid attendance ID format',
                field: 'attendanceId'
            })
        }

        const attendance = await AttendanceModel.findById(attendanceId)
        if(!attendance) {
            return response.status(404).json({
                accepted: false,
                message: 'Attendance ID does not exist',
                field: 'attendanceId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyAssignmentId = async (request, response, next) => {

    try {

        const { assignmentId } = request.params

        if(!utils.isObjectId(assignmentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid assignment ID format',
                field: 'assignmentId'
            })
        }

        const assignment = await AssignmentModel.findById(assignmentId)
        if(!assignment) {
            return response.status(404).json({
                accepted: false,
                message: 'Assignment ID does not exist',
                field: 'assignmentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifySubmissionId = async (request, response, next) => {

    try {

        const { submissionId } = request.params

        if(!utils.isObjectId(submissionId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid submission ID format',
                field: 'submissionId'
            })
        }

        const submission = await SubmissionModel.findById(submissionId)
        if(!submission) {
            return response.status(404).json({
                accepted: false,
                message: 'Submission ID does not exist',
                field: 'submissionId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyPaymentId = async (request, response, next) => {

    try {

        const { paymentId } = request.params

        if(!utils.isObjectId(paymentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid payment ID format',
                field: 'paymentId'
            })
        }

        const payment = await PaymentModel.findById(paymentId)
        if(!payment) {
            return response.status(404).json({
                accepted: false,
                message: 'Payment ID does not exist',
                field: 'paymentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifySpecializationId = async (request, response, next) => {

    try {

        const { specializationId } = request.params

        if(!utils.isObjectId(specializationId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid specialization ID format',
                field: 'specializationId'
            })
        }

        const specialization = await SpecializationModel.findById(specializationId)
        if(!specialization) {
            return response.status(404).json({
                accepted: false,
                message: 'Specialization ID does not exist',
                field: 'specializationId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyTeacherId = async (request, response, next) => {

    try {

        const { teacherId } = request.params

        if(!utils.isObjectId(teacherId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid teacher ID format',
                field: 'teacherId'
            })
        }

        const teacher = await TeacherModel.findById(teacherId)
        if(!teacher) {
            return response.status(404).json({
                accepted: false,
                message: 'Teacher ID does not exist',
                field: 'teacherId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyCourseId = async (request, response, next) => {

    try {

        const { courseId } = request.params

        if(!utils.isObjectId(courseId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid course ID format',
                field: 'courseId'
            })
        }

        const course = await CourseModel.findById(courseId)
        if(!course) {
            return response.status(404).json({
                accepted: false,
                message: 'Course ID does not exist',
                field: 'courseId'
            })
        }

        return next()

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
    verifyUserId,
    verifyGroupId,
    verifyStudentId,
    verifyExamId,
    verifyGradeId,
    verifyShiftId,
    verifySubscriptionId,
    verifyAttendanceId,
    verifyAssignmentId,
    verifySubmissionId,
    verifyPaymentId,
    verifySpecializationId,
    verifyTeacherId,
    verifyCourseId
}