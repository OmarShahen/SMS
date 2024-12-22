const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const TeacherModel = require('../models/TeacherModel')
const SpecializationModel = require('../models/SpecializationModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const teacherValidation = require('../validations/teachers')

const getUserTeachers = async (request, response) => {

    try {

        const { userId } = request.params
        let { name, specializationId, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(name) {
            searchQuery.name = { $regex: name, $options: 'i' }
        }

        if(specializationId) {
            searchQuery.specializationId = mongoose.Types.ObjectId(specializationId)
        }

        const teachers = await TeacherModel.aggregate([
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
                    from: 'specializations',
                    localField: 'specializationId',
                    foreignField: '_id',
                    as: 'specialization'
                }
            }
        ])

        teachers.forEach(teacher => {
            teacher.specialization = teacher.specialization[0]
        })

        const totalTeachers = await TeacherModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalTeachers,
            teachers
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

const addTeacher = async (request, response) => {

    try {

        const dataValidation = teacherValidation.addTeacher(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, specializationId, name } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        const specialization = await SpecializationModel.findById(specializationId)
        if(!specialization) {
            return response.status(400).json({
                accepted: false,
                message: 'Specialization ID is not registered',
                field: 'specializationId'
            })
        }

        const totalNames = await TeacherModel.countDocuments({ userId, name })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'الاسم مسجل مسبقا',
                field: 'name'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `teacher-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const teacherData = { 
            teacherId: counter.value, 
            ...request.body
        }
        const teacherObj = new TeacherModel(teacherData)
        const newTeacher = await teacherObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة المعلم بنجاح',
            teacher: newTeacher,
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


const updateTeacher = async (request, response) => {

    try {

        const dataValidation = teacherValidation.updateTeacher(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { teacherId } = request.params
        let { name, specializationId } = request.body

        const teacher = await TeacherModel.findById(teacherId)

        if(specializationId) {
            const specialization = await SpecializationModel.findById(specializationId)
            if(!specialization) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Specialization ID is not registered',
                    field: 'specializationId'
                })
            }
        }

        if(name && teacher.name != name) {
            const totalNames = await TeacherModel.countDocuments({ userId: teacher.userId, name })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'الاسم مسجل مسبقا',
                    field: 'name'
                })
            } 
        }

        const updatedTeacher = await TeacherModel
        .findByIdAndUpdate(teacherId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث المعلم بنجاح',
            teacher: updatedTeacher,
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

const deleteTeacher = async (request, response) => {

    try {

        const { teacherId } = request.params

        const deletedTeacher = await TeacherModel.findByIdAndDelete(teacherId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح المعلم بنجاح',
            teacher: deletedTeacher
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
    getUserTeachers, 
    addTeacher,
    updateTeacher,
    deleteTeacher
}