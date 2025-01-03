const GradeModel = require('../models/GradeModel')
const UserModel = require('../models/UserModel')
const ExamModel = require('../models/ExamModel')
const TeacherModel = require('../models/TeacherModel')
const CourseModel = require('../models/CourseModel')
const StudentModel = require('../models/StudentModel')
const gradeValidation = require('../validations/grades')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const { telegramBot }  = require('../bot/telegram-bot')


const getUserGrades = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, teacherId, courseId, examId, correctorId, groupId, academicYear, sorting, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(studentId) {
            searchQuery.studentId = mongoose.Types.ObjectId(studentId)
        }

        if(teacherId) {
            searchQuery.teacherId = mongoose.Types.ObjectId(teacherId)
        }
        
        if(courseId) {
            searchQuery.courseId = mongoose.Types.ObjectId(courseId)
        }

        if(groupId) {
            searchQuery.groupId = mongoose.Types.ObjectId(groupId)
        }

        if(examId) {
            searchQuery.examId = mongoose.Types.ObjectId(examId)
        }

        if(correctorId) {
            searchQuery.correctorId = mongoose.Types.ObjectId(correctorId)
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        const sortQuery = {}

        if(sorting == 'HIGH') {
            sortQuery.score = -1
        } else if(sorting == 'LOW') {
            sortQuery.score = 1
        } else {
            sortQuery.createdAt = -1
        }

        const grades = await GradeModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: sortQuery
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
                    from: 'groups',
                    localField: 'groupId',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'teacherId',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
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
            grade.group = grade.group[0]
            grade.teacher = grade.teacher[0]
            grade.course = grade.course[0]
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

const getStudentsThatAreGraded = async (request, response) => {

    try {

        const { examId } = request.params

        const grades = await GradeModel
        .find({ examId })
        .select('studentId score')

        return response.status(200).json({
            accepted: true,
            students: grades
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

        const { isNotify } = request.query
        const { userId, teacherId, courseId, studentId, examId, correctorId, score } = request.body

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

        if(teacherId) {
            const teacher = await TeacherModel.findById(teacherId)
            if(!teacher) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Teacher ID is not registered',
                    field: 'teacherId'
                })
            }
        }

        if(courseId) {
            const course = await CourseModel.findById(courseId)
            if(!course) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Course ID is not registered',
                    field: 'courseId'
                })
            }
        }

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

        if(exam.totalMarks < score) {
            return response.status(400).json({
                accepted: false,
                message: 'درجة الطالب اعلي من اجمالي درجات الاختبار',
                field: 'score'
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

        const gradeData = { ...request.body, groupId: student.groupId, academicYear: student.academicYear }
        const gradeObj = new GradeModel(gradeData)
        const newGrade = await gradeObj.save()

        const gradeMessage = `مرحبًا ${student.name}، نتيجتك في امتحان ${exam.name} هي ${newGrade.score} من ${exam.totalMarks}`

        if(isNotify == 'TRUE' && student.telegramId) {
            telegramBot.sendMessage(student.telegramId, gradeMessage)
        }

        if(isNotify == 'TRUE' && student.parentTelegramId) {
            telegramBot.sendMessage(student.parentTelegramId, gradeMessage)
        }

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
        const { score } = request.body

        if(score) {
            const grade = await GradeModel.findById(gradeId)
            const exam = await ExamModel.findById(grade.examId)

            if(exam.totalMarks < score) {
                return response.status(400).json({
                    accepted: false,
                    message: 'درجة الطالب اعلي من اجمالي درجات الاختبار',
                    field: 'score'
                })
            }
            
        }

        const updatedGrade = await GradeModel
        .findByIdAndUpdate(gradeId, request.body, { new: true })

        const student = await StudentModel.findById(updatedGrade.studentId)

        const exam = await ExamModel.findById(updatedGrade.examId)
        const gradeMessage = `مرحبًا ${student.name}، نتيجتك في امتحان ${exam.name} هي ${updatedGrade.score} من ${exam.totalMarks}`

        if(student.telegramId) {
            telegramBot.sendMessage(student.telegramId, gradeMessage)   
        }

        if(student.parentTelegramId) {
            telegramBot.sendMessage(student.parentTelegramId, gradeMessage)   
        }

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

const updateGradeByStudentIdAndExamId = async (request, response) => {

    try {

        const dataValidation = gradeValidation.updateGrade(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { studentId, examId } = request.params
        const { score } = request.body

        const exam = await ExamModel.findById(examId)
        if(exam.totalMarks < score) {
            return response.status(400).json({
                accepted: false,
                message: 'درجة الطالب اعلي من اجمالي درجات الاختبار',
                field: 'score'
            })
        }

        const updatedGrade = await GradeModel.updateOne({ studentId, examId }, { $set: { score } })

        const student = await StudentModel.findById(studentId)

        const gradeMessage = `مرحبًا ${student.name}، نتيجتك في امتحان ${exam.name} هي ${score} من ${exam.totalMarks}`

        if(student.telegramId) {
            telegramBot.sendMessage(student.telegramId, gradeMessage)   
        }

        if(student.parentTelegramId) {
            telegramBot.sendMessage(student.parentTelegramId, gradeMessage)   
        }

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

const notifyGrade = async (request, response) => {

    try {

        const { gradeId } = request.params

        const grade = await GradeModel.findById(gradeId)

        const student = await StudentModel.findById(grade.studentId)

        if(!student.telegramId) {
            return response.status(400).json({
                accepted: false,
                message: 'الطالب غير مسجل في البوت',
                field: 'gradeId'
            })
        }

        const exam = await ExamModel.findById(grade.examId)

        const gradeMessage = `مرحبًا ${student.name}، نتيجتك في امتحان ${exam.name} هي ${grade.score} من ${exam.totalMarks}`

        telegramBot.sendMessage(student.telegramId, gradeMessage)

        return response.status(200).json({
            accepted: true,
            message: 'تم ارسال التنبيه'
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


module.exports = { getUserGrades, getStudentsThatAreGraded, addGrade, updateGrade, updateGradeByStudentIdAndExamId, deleteGrade, notifyGrade }