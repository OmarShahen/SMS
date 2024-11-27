const utils = require('../utils/utils')
const config = require('../config/config')


const addPayment = (paymentData) => {

    const { userId, studentId, recorderId, subscriptionId, groupId, academicYear, paymentMethod, amount } = paymentData

    if(!userId) return { isAccepted: false, message: 'User Id is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User Id format is invalid', field: 'userId' }

    if(!studentId) return { isAccepted: false, message: 'Student Id is required', field: 'studentId' }

    if(!utils.isObjectId(studentId)) return { isAccepted: false, message: 'Student Id format is invalid', field: 'studentId' }

    if(!subscriptionId) return { isAccepted: false, message: 'Subscription Id is required', field: 'subscriptionId' }

    if(!utils.isObjectId(subscriptionId)) return { isAccepted: false, message: 'Subscription Id format is invalid', field: 'subscriptionId' }

    if(!recorderId) return { isAccepted: false, message: 'Recorder Id is required', field: 'recorderId' }

    if(!utils.isObjectId(recorderId)) return { isAccepted: false, message: 'Recorder Id format is invalid', field: 'recorderId' }

    if(!groupId) return { isAccepted: false, message: 'Group Id is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group Id format is invalid', field: 'groupId' }

    if(!paymentMethod) return { isAccepted: false, message: 'Payment method is required', field: 'paymentMethod' }

    if(!config.PAYMENT_METHODS.includes(paymentMethod)) return { isAccepted: false, message: 'Payment method value is invalid', field: 'paymentMethod' }

    if(typeof amount != 'number') return { isAccepted: false, message: 'Amount format is invalid', field: 'amount' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

const refundPayment = (paymentData) => {

    const { refunderId } = paymentData

    if(!refunderId) return { isAccepted: false, message: 'Refunder Id is required', field: 'refunderId' }

    if(!utils.isObjectId(refunderId)) return { isAccepted: false, message: 'Refunder Id format is invalid', field: 'refunderId' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

module.exports = { addPayment, refundPayment }