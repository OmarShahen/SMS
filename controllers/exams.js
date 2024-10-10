const ExamModel = require('../models/ExamModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const examValidation = require('../validations/exams')
const utils = require('../utils/utils')
const config = require('../config/config')


const getUserExams = async (request, response) => {

    try {

        const { userId } = request.params
        let { name, types, subtypes, isActive, academicYear, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        types = types ? types.split(',') : []
        subtypes = subtypes ? subtypes.split(',') : []

        if (types.length) {
            searchQuery.types = { $in: types }
        }

        if (subtypes.length) {
            searchQuery.subtypes = { $in: subtypes }
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
                $project: {
                    'user.password': 0,
                }
            }
        ])

        exams.forEach(exam => {
            exam.user = exam.user[0]
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

        const { userId, name, academicYear } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
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
        const { name } = request.body

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

const deleteExam = async (request, response) => {

    try {

        const { examId } = request.params

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


module.exports = { getUserExams, addExam, updateExam, updateExamURL, deleteExam }