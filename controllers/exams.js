const ExamModel = require('../models/ExamModel')
const UserModel = require('../models/UserModel')
const GroupModel = require('../models/GroupModel')
const GradeModel = require('../models/GradeModel')
const TeacherModel = require('../models/TeacherModel')
const CourseModel = require('../models/CourseModel')
const CounterModel = require('../models/CounterModel')
const examValidation = require('../validations/exams')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')


const getUserExams = async (request, response) => {

    try {

        const { userId } = request.params
        let { name, teacherId, courseId, groupId, type, subtype, isActive, academicYear, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(groupId) {
            searchQuery.groups = { $in: [mongoose.Types.ObjectId(groupId)] }
        }

        if(teacherId) {
            searchQuery.teacherId = mongoose.Types.ObjectId(teacherId)
        }
        
        if(courseId) {
            searchQuery.courseId = mongoose.Types.ObjectId(courseId)
        }

        if (type) {
            searchQuery.type = type
        }

        if (subtype) {
            searchQuery.subtype = subtype
        }

        if(name) {
            searchQuery.name = { $regex: name, $options: 'i' }
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        const exams = await ExamModel.aggregate([
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
                    localField: 'groups',
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
                }
            }
        ])

        exams.forEach(exam => {
            exam.user = exam.user[0]
            exam.teacher = exam.teacher[0]
            exam.course = exam.course[0]
        })

        const totalExams = await ExamModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalExams,
            exams
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

const getExam = async (request, response) => {

    try {

        const { examId } = request.params

        const exam = await ExamModel.findById(examId)

        return response.status(200).json({
            accepted: true,
            exam
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

const addExam = async (request, response) => {

    try {

        const dataValidation = examValidation.addExam(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        let { userId, teacherId, courseId, groups, name, academicYear } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

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

        const totalGroups = await GroupModel.countDocuments({ userId, academicYear, _id: { $in: groups } })
        if(totalGroups != groups.length) {
            return response.status(400).json({
                accepted: false,
                message: 'المجموعات غير مسجلة في هذه السنة الدراسية',
                field: 'groups'
            })
        }

        const totalNames = await ExamModel.countDocuments({ userId, name, academicYear })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم الاختبار مسجل مسبقا في هذه السنة الدراسية',
                field: 'name'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `exam-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const examData = { examId: counter.value, ...request.body }
        const examObj = new ExamModel(examData)
        const newExam = await examObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الاختبار بنجاح',
            exam: newExam,
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

const updateExam = async (request, response) => {

    try {

        const dataValidation = examValidation.updateExam(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { examId } = request.params
        const { name, groups } = request.body

        const exam = await ExamModel.findById(examId)

        if(name && exam.name != name) {
            const totalNames = await ExamModel.countDocuments({ userId: exam.userId, name, academicYear: exam.academicYear })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم الاختبار مسجل مسبقا في هذه السنة الدراسية',
                    field: 'name'
                })
            } 
        }

        if(groups) {
            const totalGroups = await GroupModel.countDocuments({ userId: exam.userId, academicYear: exam.academicYear, _id: { $in: groups } })
            if(totalGroups != groups.length) {
                return response.status(400).json({
                    accepted: false,
                    message: 'المجموعات غير مسجلة في هذه السنة الدراسية',
                    field: 'groups'
                })
            }
        }

        const updatedExam = await ExamModel
        .findByIdAndUpdate(examId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الاختبار بنجاح',
            exam: updatedExam,
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

const updateExamURL = async (request, response) => {

    try {

        const dataValidation = examValidation.updateExamURL(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { examId } = request.params
        const { url } = request.body

        const updatedExam = await ExamModel
        .findByIdAndUpdate(examId, { url }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث ملف الاختبار بنجاح',
            exam: updatedExam,
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

const updateExamAnswerURL = async (request, response) => {

    try {

        const dataValidation = examValidation.updateExamAnswerURL(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { examId } = request.params
        const { answerURL } = request.body

        const updatedExam = await ExamModel
        .findByIdAndUpdate(examId, { answeredURL: answerURL }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث ملف الاختبار المحلول بنجاح',
            exam: updatedExam,
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

const deleteExam = async (request, response) => {

    try {

        const { examId } = request.params

        const totalGrades = await GradeModel.countDocuments({ examId })
        if(totalGrades != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك درجات مسجلة في هذا الاختبار',
                field: 'examId'
            })
        }

        const deletedExam = await ExamModel.findByIdAndDelete(examId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الاختبار بنجاح',
            exam: deletedExam
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


module.exports = { getUserExams, getExam, addExam, updateExam, updateExamURL, updateExamAnswerURL, deleteExam }