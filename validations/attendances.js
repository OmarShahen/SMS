const utils = require('../utils/utils')
const config = require('../config/config')

const addAttendance = (attendanceData) => {

    const { userId, studentId, shiftId, recorderId, status } = attendanceData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!studentId) return { isAccepted: false, message: 'Student ID is required', field: 'studentId' }

    if(!utils.isObjectId(studentId)) return { isAccepted: false, message: 'Student ID format is invalid', field: 'studentId' }

    if(!shiftId) return { isAccepted: false, message: 'Shift ID is required', field: 'shiftId' }

    if(!utils.isObjectId(shiftId)) return { isAccepted: false, message: 'Shift ID format is invalid', field: 'shiftId' }

    if(!recorderId) return { isAccepted: false, message: 'Recorder ID is required', field: 'recorderId' }

    if(!utils.isObjectId(recorderId)) return { isAccepted: false, message: 'Recorder ID format is invalid', field: 'recorderId' }

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.ATTENDANCE_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    

    return { isAccepted: true, message: 'data is valid', data: attendanceData }
}

const updateAttendanceStatus = (attendanceData) => {

    const { status } = attendanceData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.ATTENDANCE_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    

    return { isAccepted: true, message: 'data is valid', data: attendanceData }
}

module.exports = { addAttendance, updateAttendanceStatus }