const StudentModel = require('../models/StudentModel')
const GroupModel = require('../models/GroupModel')
const UserModel = require('../models/UserModel')
const CourseModel = require('../models/CourseModel')
const GradeModel = require('../models/GradeModel')
const CounterModel = require('../models/CounterModel')
const studentValidation = require('../validations/students')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const { telegramBot } = require('../bot/telegram-bot')
const { MENU_MESSAGE } = require('../bot/messages/messages')
const { v4: uuidv4 } = require('uuid')


const getUserStudents = async (request, response) => {

    try {

        const { userId } = request.params
        let { studentId, groupId, courseId, name, phone, gender, referredBy, isActive, academicYear, isTelegram, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        searchQuery = name || phone ? { ...searchQuery, $or: [] } : { ...searchQuery }

        if(studentId) {
            searchQuery._id = mongoose.Types.ObjectId(studentId)
        }

        if(name) {
            searchQuery.$or.push({ name: { $regex: name, $options: 'i' } })
        }

        if(phone) {
            searchQuery.$or.push({ phone: { $regex: phone, $options: 'i' } })
        }

        if(groupId) {
            searchQuery.groupId = mongoose.Types.ObjectId(groupId)
        }

        if(courseId) {
            searchQuery.courseId = mongoose.Types.ObjectId(courseId)
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        if(isTelegram == 'TRUE') {
            searchQuery.telegramId = { $ne: null }
        } else if(isTelegram == 'FALSE') {
            searchQuery.telegramId = null
        }

        if(gender) {
            searchQuery.gender = gender
        }

        if(referredBy) {
            searchQuery.referredBy = referredBy
        }

        const students = await StudentModel.aggregate([
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
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'subscriptionId',
                    foreignField: '_id',
                    as: 'subscription'
                }
            },
            {
                $project: {
                    'user.password': 0,
                }
            }
        ])

        students.forEach(student => {
            student.user = student.user[0]
            student.group = student.group[0]
            student.course = student.course[0]
            student.subscription = student.subscription[0]
        })

        const totalStudents = await StudentModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalStudents,
            students
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

const getStudentByQRCodeUUID = async (request, response) => {

    try {

        const { QRCodeUUID } = request.params

        const students = await StudentModel.aggregate([
            {
                $match: { QRCodeUUID }
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
                    from: 'subscriptions',
                    localField: 'subscriptionId',
                    foreignField: '_id',
                    as: 'subscription'
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'subscription.payments',
                    foreignField: '_id',
                    as: 'payments'
                }
            },
            {
                $project: {
                    'user.password': 0,
                }
            }
        ])

        students.forEach(student => {
            student.group = student.group[0]
            student.subscription = student.subscription[0]
        })

        return response.status(200).json({
            accepted: true,
            students
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

const addStudent = async (request, response) => {

    try {

        const dataValidation = studentValidation.addStudent(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, groupId, courseId, telegramId, name, phone } = request.body

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

        if(telegramId) {
            const totalTelegram = await StudentModel.countDocuments({ userId, telegramId })
            if(totalTelegram != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'انت مسجل مسبقا علي التليجرام',
                    field: 'telegramId'
                })
            }
        }

        /*const totalGroupStudents = await StudentModel.countDocuments({ groupId })
        if(group.capacity <= totalGroupStudents) {
            return response.status(400).json({
                accepted: false,
                message: 'لا يوجد مكان في المجموعة',
                field: 'groupId'
            })
        }*/

        const counter = await CounterModel.findOneAndUpdate(
            { name: `student-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const studentData = { 
            studentId: counter.value, 
            ...request.body,
            QRCodeUUID: uuidv4()
        }
        const studentObj = new StudentModel(studentData)
        const newStudent = await studentObj.save()

        if(telegramId) {
            const message = `✅ تم إنشاء حسابك بنجاح يا ${newStudent.name}!`
            telegramBot.sendMessage(newStudent.telegramId, message)
            telegramBot.sendMessage(newStudent.telegramId, MENU_MESSAGE)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الطالب بنجاح',
            student: newStudent,
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

const updateStudent = async (request, response) => {

    try {

        const dataValidation = studentValidation.updateStudent(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { studentId } = request.params
        let { name, phone, groupId, courseId, telegramId } = request.body

        const student = await StudentModel.findById(studentId)

        if(groupId && student.groupId != groupId) {
            const group = await GroupModel.findById(groupId)
            if(!group) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Group ID does not exist',
                    field: 'groupId'
                })
            }

            const totalGroupStudents = await StudentModel.countDocuments({ groupId })
            if(group.capacity <= totalGroupStudents) {
                return response.status(400).json({
                    accepted: false,
                    message: 'لا يوجد مكان في المجموعة',
                    field: 'groupId'
                })
            }
        }

        if(courseId && student.courseId != courseId) {
            const course = await CourseModel.findById(courseId)
            if(!course) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Course ID does not exist',
                    field: 'courseId'
                })
            }
        }

        if(telegramId && student.telegramId != telegramId) {
            const totalTelegram = await StudentModel.countDocuments({ userId: student.userId, telegramId })
            if(totalTelegram != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'انت مسجل مسبقا علي التليجرام',
                    field: 'telegramId'
                })
            }
        }

        groupId = groupId && student.groupId != groupId ? groupId : student.groupId

        if(name && student.name != name) {
            const totalNames = await StudentModel.countDocuments({ userId: student.userId, groupId, name })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم الطالب مسجل مسبقا في هذه المجموعة',
                    field: 'name'
                })
            } 
        }

        if(phone && student.phone != phone) {
            const totalPhones = await StudentModel.countDocuments({ userId: student.userId, phone })
            if(totalPhones != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'هاتف الطالب مسجل مسبقا',
                    field: 'phone'
                })
            } 
        }

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(studentId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الطالب بنجاح',
            student: updatedStudent,
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

const deleteStudent = async (request, response) => {

    try {

        const { studentId } = request.params

        const totalGrades = await GradeModel.countDocuments({ studentId })
        if(totalGrades != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك درجات مسجلة في هذا الطالب',
                field: 'studentId'
            })
        }

        const deletedStudent = await StudentModel.findByIdAndDelete(studentId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الطالب بنجاح',
            student: deletedStudent
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

const removeTelegramID = async (request, response) => {

    try {

        const { studentId } = request.params

        const student = await StudentModel.findById(studentId)

        if(!student.telegramId) {
            return response.status(400).json({
                accepted: false,
                message: 'الطالب غير مسجل في التليجرام',
                field: 'studentId'
            })
        }

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(studentId, { telegramId: null }, { new: true })

        telegramBot.sendMessage(student.telegramId, `تم تسجيل خروج حساب ${student.name}`)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح اشتراك التليجرام بنجاح',
            student: updatedStudent
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

const createNewQRCodeUUID = async (request, response) => {

    try {

        const { studentId } = request.params

        const QRCodeUUID = uuidv4()

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(studentId, { QRCodeUUID }, { new: true })

        if(updatedStudent.telegramId) {
            const message = `تم انشاء كود تسجيل حضور جديد: ${config.URL}/qr-code/${updatedStudent.QRCodeUUID}`
            telegramBot.sendMessage(updatedStudent.telegramId, message)
        }

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث كود الاستجابة السريع للطالب بنجاح',
            student: updatedStudent
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
    getUserStudents, 
    getStudentByQRCodeUUID,
    addStudent, 
    updateStudent, 
    deleteStudent, 
    removeTelegramID, 
    createNewQRCodeUUID 
}