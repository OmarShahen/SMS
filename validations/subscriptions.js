const config = require('../config/config')
const utils = require('../utils/utils')


const addSubscription = (subscriptionData) => {

    const { userId, studentId, groupId, recorderId, allowedSessions, startDate, endDate } = subscriptionData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!studentId) return { isAccepted: false, message: 'Student ID is required', field: 'studentId' }

    if(!utils.isObjectId(studentId)) return { isAccepted: false, message: 'Student ID format is invalid', field: 'studentId' }

    if(!groupId) return { isAccepted: false, message: 'Group ID is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }

    if(!recorderId) return { isAccepted: false, message: 'Recorder ID is required', field: 'recorderId' }

    if(!utils.isObjectId(recorderId)) return { isAccepted: false, message: 'Recorder ID format is invalid', field: 'recorderId' }

    if(typeof allowedSessions != 'number' || allowedSessions <= 0) return { isAccepted: false, message: 'Allowed sessions format is invalid', field: 'allowedSessions' }

    if(startDate && !utils.isDateValid(startDate)) return { isAccepted: false, message: 'Start date format is invalid', field: 'startDate' }

    if(!endDate) return { isAccepted: false, message: 'End date is required', field: 'endDate' }

    if(!utils.isDateValid(endDate)) return { isAccepted: false, message: 'End date format is invalid', field: 'endDate' }

    if(startDate ? startDate : new Date() && endDate && new Date(startDate ? startDate : new Date()) > new Date(endDate)) return { isAccepted: false, message: 'تاريخ الانتهاء يجب ان يكون بعد تاريخ البدء', field: 'endDate' }

    return { isAccepted: true, message: 'data is valid', data: subscriptionData }
}

const updateSubscriptionStatus = (subscriptionData) => {

    const { status } = subscriptionData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.SUBSCRIPTION_STATUS.includes(status)) return { isAccepted: false, message: 'Status format is invalid', field: 'status' }

    return { isAccepted: true, message: 'data is valid', data: subscriptionData }
}


module.exports = { addSubscription, updateSubscriptionStatus }