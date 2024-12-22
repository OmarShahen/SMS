const GroupModel = require('../models/GroupModel')
const ShiftModel = require('../models/ShiftModel')
const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const AssignmentModel = require('../models/AssignmentModel')
const CounterModel = require('../models/CounterModel')
const shiftValidation = require('../validations/shifts')
const utils = require('../utils/utils')
const config = require('../config/config')
const mongoose = require('mongoose')
const AttendanceModel = require('../models/AttendanceModel')
const TeacherModel = require('../models/TeacherModel')
const CourseModel = require('../models/CourseModel')


const getAbsentStudents = (students, attendances) => {
    
    const absentStudents = []

    for(let i=0;i<students.length;i++) {
        const student = students[i]
        let isAdd = true
        for(let j=0;j<attendances.length;j++) {
            const attendance = attendances[j]
            if(student._id.equals(attendance.studentId)) {
                isAdd = false
                break
            }
        }

        if(isAdd) {
            absentStudents.push(student)
        }
    }

    return absentStudents
}

const getUserShifts = async (request, response) => {

    try {

        const { userId } = request.params
        let { recorderId, teacherId, courseId, groupId, isActive, academicYear, limit, page } = request.query

        const { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(recorderId) {
            searchQuery.recorderId = mongoose.Types.ObjectId(recorderId)
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

        if(academicYear) {
            searchQuery.academicYear = academicYear
        }

        if(isActive == 'TRUE') {
            searchQuery.isActive = true
        } else if(isActive == 'FALSE') {
            searchQuery.isActive = false
        }

        const shifts = await ShiftModel.aggregate([
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
                    from: 'users',
                    localField: 'recorderId',
                    foreignField: '_id',
                    as: 'recorder'
                }
            },
            {
                $lookup: {
                    from: 'assignments',
                    localField: 'assignmentId',
                    foreignField: '_id',
                    as: 'assignment'
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
                    'recorder.password': 0
                }
            }
        ])

        shifts.forEach(shift => {
            shift.user = shift.user[0]
            shift.recorder = shift.recorder[0]
            shift.group = shift.group[0]
            shift.assignment = shift.assignment[0]
            shift.teacher = shift.teacher[0]
            shift.course = shift.course[0]
        })

        const totalShifts = await ShiftModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalShifts,
            shifts
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

const getShift = async (request, response) => {

    try {

        const { shiftId } = request.params

        const shiftList = await ShiftModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(shiftId) }
            },
            {
                $lookup: {
                    from: 'assignments',
                    localField: 'assignmentId',
                    foreignField: '_id',
                    as: 'assignment'
                }
            }
        ])

        shiftList.forEach(shift => {
            shift.assignment = shift.assignment[0]
        })

        const shift = shiftList[0]

        return response.status(200).json({
            accepted: true,
            shift
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

const addShift = async (request, response) => {

    try {

        const dataValidation = shiftValidation.addShift(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, teacherId, courseId, recorderId, groupId, assignmentId } = request.body

        const userPromise = UserModel.findById(userId)
        const recorderPromise = UserModel.findById(recorderId)
        const groupPromise = GroupModel.findById(groupId)

        const [user, recorder, group] = await Promise.all([
            userPromise,
            recorderPromise,
            groupPromise
        ])

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

        if(!recorder) {
            return response.status(400).json({
                accepted: false,
                message: 'Recorder ID is not registered',
                field: 'recorderId'
            })
        }

        if(!group) {
            return response.status(400).json({
                accepted: false,
                message: 'Group ID is not registered',
                field: 'groupId'
            })
        }

        if(assignmentId) {
            const assignment = await AssignmentModel.findById(assignmentId)
            if(!assignment) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Assignment ID is not registered',
                    field: 'assignmentId'
                })
            }
        }

        const totalActiveShifts = await ShiftModel.countDocuments({ groupId, isActive: true })
        if(totalActiveShifts != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'التسجيل مفتوح مسبقا في هذه المجموعة',
                field: 'groupId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `shift-${userId}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const shiftData = { shiftId: counter.value, ...request.body }
        const shiftObj = new ShiftModel(shiftData)
        const newShift = await shiftObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم فتح تسجيل المجموعة بنجاح',
            shift: newShift,
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

const updateShift = async (request, response) => {

    try {

        const dataValidation = shiftValidation.updateShift(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { shiftId } = request.params
        const { note } = request.body

        const updatedShift = await ShiftModel
        .findByIdAndUpdate(shiftId, { note }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث وردية الحضور بنجاح',
            shift: updatedShift,
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

const deleteShift = async (request, response) => {

    try {

        const { shiftId } = request.params

        const deletedShift = await ShiftModel.findByIdAndDelete(shiftId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح تسجيل الحضور بنجاح',
            shift: deletedShift
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

const closeShift = async (request, response) => {

    try {

        const { shiftId } = request.params

        const shift = await ShiftModel.findById(shiftId)
        if(!shift.isActive) {
            return response.status(400).json({
                accepted: false,
                message: 'تسجيل الحضور مغلق مسبقا',
                field: 'shiftId'
            })
        }

        const students = await StudentModel.aggregate([
            {
                $match: { groupId: shift.groupId }
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
                $unwind: '$subscription'
            },
            {
                $match: { 'subscription.status': { $ne: 'CANCELLED' }, 'subscription.endDate': { $gt: new Date() } }
            }
        ])
        
        const studentsAttendance = await AttendanceModel.find({ shiftId })
        const absentStudents = getAbsentStudents(students, studentsAttendance)

        const attendanceRecords = absentStudents.map(absentStudent => {
            return {
                studentName: absentStudent.name,
                userId: shift.userId,
                studentId: absentStudent._id,
                groupId: shift.groupId,
                shiftId: shift._id,
                subscriptionId: absentStudent.subscriptionId,
                recorderId: shift.userId,
                status: 'ABSENT',
                academicYear: shift.academicYear,
                note: shift.note
            }
        })

        const addedAttendances = await AttendanceModel.insertMany(attendanceRecords)

        const updatedShift = await ShiftModel
        .findByIdAndUpdate(shiftId, { isActive: false, endTime: new Date() }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم غلق تسجيل الحضور بنجاح',
            shift: updatedShift,
            addedAttendances
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

const getShiftStats = async (request, response) => {

    try {

        const { shiftId } = request.params

        const totalPresentAttendance = await AttendanceModel.countDocuments({ shiftId, status: 'PRESENT' })

        const totalAbsentAttendance = await AttendanceModel.countDocuments({ shiftId, status: 'ABSENT' })

        const totalExcusedAttendance = await AttendanceModel.countDocuments({ shiftId, status: 'EXCUSED' })

        return response.status(200).json({
            accepted: true,
            totalPresentAttendance,
            totalAbsentAttendance,
            totalExcusedAttendance 
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


module.exports = { getUserShifts, getShift, addShift, updateShift, closeShift, deleteShift, getShiftStats }