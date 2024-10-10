const utils = require('../utils/utils')


const addShift = (shiftData) => {

    const { userId, recorderId, groupId } = shiftData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!recorderId) return { isAccepted: false, message: 'Recorder ID is required', field: 'recorderId' }

    if(!utils.isObjectId(recorderId)) return { isAccepted: false, message: 'Recorder ID format is invalid', field: 'recorderId' }

    if(!groupId) return { isAccepted: false, message: 'Group ID is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }


    return { isAccepted: true, message: 'data is valid', data: shiftData }
}


module.exports = { addShift }