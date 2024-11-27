const utils = require('../utils/utils')
const config = require('../config/config')


const addShift = (shiftData) => {

    const { userId, recorderId, groupId, assignmentId, academicYear } = shiftData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!recorderId) return { isAccepted: false, message: 'Recorder ID is required', field: 'recorderId' }

    if(!utils.isObjectId(recorderId)) return { isAccepted: false, message: 'Recorder ID format is invalid', field: 'recorderId' }

    if(!groupId) return { isAccepted: false, message: 'Group ID is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }

    if(assignmentId && !utils.isObjectId(assignmentId)) return { isAccepted: false, message: 'Assignment ID format is invalid', field: 'assignmentId' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }


    return { isAccepted: true, message: 'data is valid', data: shiftData }
}


module.exports = { addShift }