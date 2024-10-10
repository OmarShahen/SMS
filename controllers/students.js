const StudentModel = require('../models/StudentModel')
const GroupModel = require('../models/GroupModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const studentValidation = require('../validations/students')
const utils = require('../utils/utils')
const config = require('../config/config')


const getUserStudents = async (request, response) => {

    try {

        const { userId } = request.params
        let { groupId, name, phone, parentPhone, gender, referredBy, isActive, academicYear, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        searchQuery = name || phone || parentPhone ? { ...searchQuery, $or: [] } : { ...searchQuery }

        if(name) {
            searchQuery.$or.push({ name: { $regex: name, $options: 'i' } })
        }

        if(phone) {
            searchQuery.$or.push({ phone: { $regex: phone, $options: 'i' } })
        }

        if(parentPhone) {
            searchQuery.$or.push({ parentPhone: { $regex: parentPhone, $options: 'i' } })
        }

        if(groupId) {
            searchQuery.groupId = groupId
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        if(academicYear) {
            searchQuery.academicYear = academicYear
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
                $project: {
                    'user.password': 0,
                }
            }
        ])

        students.forEach(student => {
            student.user = student.user[0]
            student.group = student.group[0]
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

        const { userId, groupId, name, phone } = request.body

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

        const totalNames = await StudentModel.countDocuments({ userId, groupId, name })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم الطالب مسجل مسبقا في هذه المجموعة',
                field: 'name'
            })
        }

        const totalPhones = await StudentModel.countDocuments({ userId, groupId, phone })
        if(totalPhones != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هاتف الطالب مسجل مسبقا في هذه المجموعة',
                field: 'phone'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `student-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const studentData = { studentId: counter.value, ...request.body }
        const studentObj = new StudentModel(studentData)
        const newStudent = await studentObj.save()

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
        const { name, phone } = request.body

        const student = await StudentModel.findById(studentId)

        if(name && student.name != name) {
            const totalNames = await StudentModel.countDocuments({ userId: student.userId, groupId: student.groupId, name })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم الطالب مسجل مسبقا في هذه المجموعة',
                    field: 'name'
                })
            } 
        }

        if(phone && student.phone != phone) {
            const totalPhones = await StudentModel.countDocuments({ userId: student.userId, groupId: student.groupId, phone })
            if(totalPhones != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'هاتف الطالب مسجل مسبقا في هذه المجموععة',
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



module.exports = { getUserStudents, addStudent, updateStudent, deleteStudent }