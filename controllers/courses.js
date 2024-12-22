const CourseModel = require('../models/CourseModel')
const TeacherModel = require('../models/TeacherModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const courseValidation = require('../validations/courses')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const SpecializationModel = require('../models/SpecializationModel')


const getUserCourses = async (request, response) => {

    try {

        const { userId } = request.params
        let { teacherId, specializationId, name, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(name) {
            searchQuery.name = { $regex: name, $options: 'i' }
        }

        if(teacherId) {
            searchQuery.teacherId = mongoose.Types.ObjectId(teacherId)
        }

        if(specializationId) {
            searchQuery.specializationId = mongoose.Types.ObjectId(specializationId)
        }

        const courses = await CourseModel.aggregate([
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
                    from: 'teachers',
                    localField: 'teacherId',
                    foreignField: '_id',
                    as: 'teacher'
                }
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

        courses.forEach(course => {
            course.teacher = course.teacher[0]
            course.specialization = course.specialization[0]
        })

        const totalCourses = await CourseModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalCourses,
            courses
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

const addCourse = async (request, response) => {

    try {

        const dataValidation = courseValidation.addCourse(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, teacherId, specializationId, name } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        const teacher = await TeacherModel.findById(teacherId)
        if(!teacher) {
            return response.status(400).json({
                accepted: false,
                message: 'Teacher ID is not registered',
                field: 'teacherId'
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

        const totalNames = await CourseModel.countDocuments({ userId, teacherId, name, specializationId })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم الكورس مسجل مسبقا',
                field: 'name'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `course-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const courseData = { 
            courseId: counter.value, 
            ...request.body
        }
        const courseObj = new CourseModel(courseData)
        const newCourse = await courseObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الكورس بنجاح',
            course: newCourse,
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

const updateCourse = async (request, response) => {

    try {

        const dataValidation = courseValidation.updateCourse(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { courseId } = request.params
        let { name } = request.body

        const course = await CourseModel.findById(courseId)

        if(name && course.name != name) {
            const totalNames = await CourseModel
            .countDocuments({ userId: course.userId, teacherId: course.teacherId, specializationId: course.specializationId, name })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم الكورس مسجل مسبقا مع المعلم في هذا التخصص',
                    field: 'name'
                })
            } 
        }

        const updatedCourse = await CourseModel
        .findByIdAndUpdate(courseId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الكورس بنجاح',
            course: updatedCourse,
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

const deleteCourse = async (request, response) => {

    try {

        const { courseId } = request.params

        const deletedCourse = await CourseModel.findByIdAndDelete(courseId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الكورس بنجاح',
            course: deletedCourse
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
    getUserCourses, 
    addCourse, 
    updateCourse, 
    deleteCourse
}