const GroupModel = require('../models/GroupModel')
const GradeModel = require('../models/GradeModel')
const UserModel = require('../models/UserModel')
const ExamModel = require('../models/ExamModel')
const StudentModel = require('../models/StudentModel')
const CounterModel = require('../models/CounterModel')
const gradeValidation = require('../validations/grades')
const utils = require('../utils/utils')
const config = require('../config/config')


const getUserGrades = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, examId, correctorId, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(studentId) {
            searchQuery.studentId = studentId
        }

        if(examId) {
            searchQuery.examId = examId
        }

        if(correctorId) {
            searchQuery.correctorId = correctorId
        }

        const grades = await GradeModel.aggregate([
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
                    from: 'exams',
                    localField: 'examId',
                    foreignField: '_id',
                    as: 'exam'
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
                    localField: 'correctorId',
                    foreignField: '_id',
                    as: 'corrector'
                }
            },
            {
                $project: {
                    'user.password': 0,
                    'corrector.password': 0
                }
            }
        ])

        grades.forEach(grade => {
            grade.user = grade.user[0]
            grade.exam = grade.exam[0]
            grade.student = grade.student[0]
            grade.corrector = grade.corrector[0]
        })

        const totalGrades = await GradeModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalGrades,
            grades
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


const addGrade = async (request, response) => {

    try {

        const dataValidation = gradeValidation.addGrade(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, studentId, examId, correctorId } = request.body

        const userPromise = UserModel.findById(userId)
        const studentPromise = StudentModel.findById(studentId)
        const examPromise = ExamModel.findById(examId)
        const correctorPromise = UserModel.findById(correctorId)

        const [user, student, exam, corrector] = await Promise.all([
            userPromise,
            studentPromise,
            examPromise,
            correctorPromise
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

        if(!exam) {
            return response.status(400).json({
                accepted: false,
                message: 'Exam ID is not registered',
                field: 'examId'
            })
        }

        if(!corrector) {
            return response.status(400).json({
                accepted: false,
                message: 'Corrector ID is not registered',
                field: 'correctorId'
            })
        }

        const totalExamGrades = await GradeModel.countDocuments({ studentId, examId })
        if(totalExamGrades != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'درجة الطالب مسجلة مسبقا في هذا الاختبار',
                field: 'studentId'
            })
        }

        const gradeData = { ...request.body }
        const gradeObj = new GradeModel(gradeData)
        const newGrade = await gradeObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الدرجة بنجاح',
            grade: newGrade,
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

const updateGrade = async (request, response) => {

    try {

        const dataValidation = gradeValidation.updateGrade(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { gradeId } = request.params

        const updatedGrade = await GradeModel
        .findByIdAndUpdate(gradeId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الدرجة بنجاح',
            grade: updatedGrade,
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

const deleteGrade = async (request, response) => {

    try {

        const { gradeId } = request.params

        const deletedGrade = await GradeModel.findByIdAndDelete(gradeId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الدرجة بنجاح',
            grade: deletedGrade
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


module.exports = { getUserGrades, addGrade, updateGrade, deleteGrade }