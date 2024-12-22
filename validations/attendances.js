const utils = require('../utils/utils')
const config = require('../config/config')

const addAttendance = (attendanceData) => {

    const { userId, teacherId, courseId, studentId, shiftId, recorderId, groupId, status, academicYear, note } = attendanceData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(teacherId && !utils.isObjectId(teacherId)) return { isAccepted: false, message: 'Teacher ID format is invalid', field: 'teacherId' }
    
    if(courseId && !utils.isObjectId(courseId)) return { isAccepted: false, message: 'Course ID format is invalid', field: 'courseId' }

    if(!studentId) return { isAccepted: false, message: 'Student ID is required', field: 'studentId' }

    if(!utils.isObjectId(studentId)) return { isAccepted: false, message: 'Student ID format is invalid', field: 'studentId' }

    if(!shiftId) return { isAccepted: false, message: 'Shift ID is required', field: 'shiftId' }

    if(!utils.isObjectId(shiftId)) return { isAccepted: false, message: 'Shift ID format is invalid', field: 'shiftId' }

    if(!recorderId) return { isAccepted: false, message: 'Recorder ID is required', field: 'recorderId' }

    if(!utils.isObjectId(recorderId)) return { isAccepted: false, message: 'Recorder ID format is invalid', field: 'recorderId' }

    if(!groupId) return { isAccepted: false, message: 'Group ID is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.ATTENDANCE_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    
    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }


    return { isAccepted: true, message: 'data is valid', data: attendanceData }
}

const updateAttendanceStatus = (attendanceData) => {

    const { status, note } = attendanceData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.ATTENDANCE_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    
    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }

    return { isAccepted: true, message: 'data is valid', data: attendanceData }
}

module.exports = { addAttendance, updateAttendanceStatus }