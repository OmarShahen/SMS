const utils = require('../utils/utils')
const UserModel = require('../models/UserModel')
const SpecialityModel = require('../models/SpecialityModel')
const ItemModel = require('../models/ItemModel')
const OrderModel = require('../models/OrderModel')
const SupplierModel = require('../models/SupplierModel')
const StockRecordModel = require('../models/StockRecordModel')
const TableModel = require('../models/TableModel')
const GroupModel = require('../models/GroupModel')
const StudentModel = require('../models/StudentModel')
const ExamModel = require('../models/ExamModel')
const GradeModel = require('../models/GradeModel')
const ShiftModel = require('../models/ShiftModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const AttendanceModel = require('../models/AttendanceModel')
const AssignmentModel = require('../models/AssignmentModel')
const SubmissionModel = require('../models/SubmissionModel')


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

const verifySpecialityId = async (request, response, next) => {

    try {

        const { specialityId } = request.params

        if(!utils.isObjectId(specialityId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid speciality Id formate',
                field: 'specialityId'
            })
        }

        const speciality = await SpecialityModel.findById(specialityId)
        if(!speciality) {
            return response.status(404).json({
                accepted: false,
                message: 'speciality Id does not exist',
                field: 'specialityId'
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

const verifyItemId = async (request, response, next) => {

    try {

        const { itemId } = request.params

        if(!utils.isObjectId(itemId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid item ID format',
                field: 'itemId'
            })
        }

        const item = await ItemModel.findById(itemId)
        if(!item) {
            return response.status(404).json({
                accepted: false,
                message: 'Item ID does not exist',
                field: 'itemId'
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

const verifyOrderId = async (request, response, next) => {

    try {

        const { orderId } = request.params

        if(!utils.isObjectId(orderId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid order ID format',
                field: 'orderId'
            })
        }

        const order = await OrderModel.findById(orderId)
        if(!order) {
            return response.status(404).json({
                accepted: false,
                message: 'Order ID does not exist',
                field: 'orderId'
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

const verifySupplierId = async (request, response, next) => {

    try {

        const { supplierId } = request.params

        if(!utils.isObjectId(supplierId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid supplier ID format',
                field: 'supplierId'
            })
        }

        const supplier = await SupplierModel.findById(supplierId)
        if(!supplier) {
            return response.status(404).json({
                accepted: false,
                message: 'Supplier ID does not exist',
                field: 'supplierId'
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

const verifyStockRecordId = async (request, response, next) => {

    try {

        const { stockRecordId } = request.params

        if(!utils.isObjectId(stockRecordId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid stock record ID format',
                field: 'stockRecordId'
            })
        }

        const stockRecord = await StockRecordModel.findById(stockRecordId)
        if(!stockRecord) {
            return response.status(404).json({
                accepted: false,
                message: 'Stock record ID does not exist',
                field: 'stockRecordId'
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

const verifyTableId = async (request, response, next) => {

    try {

        const { tableId } = request.params

        if(!utils.isObjectId(tableId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid table ID format',
                field: 'tableId'
            })
        }

        const table = await TableModel.findById(tableId)
        if(!table) {
            return response.status(404).json({
                accepted: false,
                message: 'Table ID does not exist',
                field: 'tableId'
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

module.exports = { 
    verifyUserId,
    verifySpecialityId,
    verifyItemId,
    verifyOrderId,
    verifySupplierId,
    verifyStockRecordId,
    verifyTableId,
    verifyGroupId,
    verifyStudentId,
    verifyExamId,
    verifyGradeId,
    verifyShiftId,
    verifySubscriptionId,
    verifyAttendanceId,
    verifyAssignmentId,
    verifySubmissionId
}