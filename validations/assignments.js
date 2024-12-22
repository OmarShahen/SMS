const utils = require('../utils/utils')
const config = require('../config/config')

const addAssignment = (assignmentData) => {

    const { userId, teacherId, courseId, groups, title, description, isActive, totalMarks, dueDate, academicYear } = assignmentData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(teacherId && !utils.isObjectId(teacherId)) return { isAccepted: false, message: 'Teacher ID format is invalid', field: 'teacherId' }
    
    if(courseId && !utils.isObjectId(courseId)) return { isAccepted: false, message: 'Course ID format is invalid', field: 'courseId' }

    if(!Array.isArray(groups) || groups.length == 0) return { isAccepted: false, message: 'Groups format is invalid', field: 'groups' }

    if(!groups.every(groupId => utils.isObjectId(groupId))) return { isAccepted: false, message: 'Groups value is invalid', field: 'groups' }

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(typeof title != 'string') return { isAccepted: false, message: 'Title format is invalid', field: 'title' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(totalMarks && typeof totalMarks != 'number') return { isAccepted: false, message: 'Total marks format is invalid', field: 'totalMarks' }

    if(!dueDate) return { isAccepted: false, message: 'Due date is required', field: 'dueDate' }

    if(!utils.isDateTimeValid(dueDate)) return { isAccepted: false, message: 'Due date format is invalid', field: 'dueDate' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }


    return { isAccepted: true, message: 'data is valid', data: assignmentData }
}

const updateAssignment = (assignmentData) => {

    const { groups, title, description, isActive, totalMarks, dueDate, academicYear } = assignmentData

    if(groups && !Array.isArray(groups)) return { isAccepted: false, message: 'Groups format is invalid', field: 'groups' }

    if(groups && !groups.every(groupId => utils.isObjectId(groupId))) return { isAccepted: false, message: 'Groups value is invalid', field: 'groups' }

    if(title && typeof title != 'string') return { isAccepted: false, message: 'Title format is invalid', field: 'title' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(totalMarks && typeof totalMarks != 'number') return { isAccepted: false, message: 'Total marks format is invalid', field: 'totalMarks' }

    if(dueDate && !utils.isDateTimeValid(dueDate)) return { isAccepted: false, message: 'Due date format is invalid', field: 'dueDate' }

    if(academicYear && !config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    return { isAccepted: true, message: 'data is valid', data: assignmentData }
}

const updateAssignmentURL = (assignmentData) => {

    const { url } = assignmentData

    if(!url) return { isAccepted: false, message: 'URL is required', field: 'url' }

    if(!utils.isValidURL(url)) return { isAccepted: false, message: 'URL format is invalid', field: 'url' }

    return { isAccepted: true, message: 'data is valid', data: assignmentData }
}

module.exports = { addAssignment, updateAssignment, updateAssignmentURL }