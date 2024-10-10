const utils = require('../utils/utils')


const addAssignment = (assignmentData) => {

    const { userId, groupId, title, description, isActive, totalMarks, dueDate } = assignmentData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!groupId) return { isAccepted: false, message: 'Group ID is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(typeof title != 'string') return { isAccepted: false, message: 'Title format is invalid', field: 'title' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(totalMarks && typeof totalMarks != 'number') return { isAccepted: false, message: 'Total marks format is invalid', field: 'totalMarks' }

    if(!dueDate) return { isAccepted: false, message: 'Due date is required', field: 'dueDate' }

    if(!utils.isDateTimeValid(dueDate)) return { isAccepted: false, message: 'Due date format is invalid', field: 'dueDate' }


    return { isAccepted: true, message: 'data is valid', data: assignmentData }
}

const updateAssignment = (assignmentData) => {

    const { title, description, isActive, totalMarks, dueDate } = assignmentData

    if(title && typeof title != 'string') return { isAccepted: false, message: 'Title format is invalid', field: 'title' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(totalMarks && typeof totalMarks != 'number') return { isAccepted: false, message: 'Total marks format is invalid', field: 'totalMarks' }

    if(dueDate && !utils.isDateTimeValid(dueDate)) return { isAccepted: false, message: 'Due date format is invalid', field: 'dueDate' }


    return { isAccepted: true, message: 'data is valid', data: assignmentData }
}

const updateAssignmentURL = (assignmentData) => {

    const { url } = assignmentData

    if(!url) return { isAccepted: false, message: 'URL is required', field: 'url' }

    if(!utils.isValidURL(url)) return { isAccepted: false, message: 'URL format is invalid', field: 'url' }

    return { isAccepted: true, message: 'data is valid', data: assignmentData }
}

module.exports = { addAssignment, updateAssignment, updateAssignmentURL }