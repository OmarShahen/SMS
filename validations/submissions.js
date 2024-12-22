const utils = require('../utils/utils')
const config = require('../config/config')

const addSubmission = (submissionData) => {

    const { userId, teacherId, courseId, studentId, assignmentId, score, submissionDate, status, note } = submissionData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(teacherId && !utils.isObjectId(teacherId)) return { isAccepted: false, message: 'Teacher ID format is invalid', field: 'teacherId' }
    
    if(courseId && !utils.isObjectId(courseId)) return { isAccepted: false, message: 'Course ID format is invalid', field: 'courseId' }

    if(!studentId) return { isAccepted: false, message: 'Student ID is required', field: 'studentId' }

    if(!utils.isObjectId(studentId)) return { isAccepted: false, message: 'Student ID format is invalid', field: 'studentId' }

    if(!assignmentId) return { isAccepted: false, message: 'Assignment ID is required', field: 'assignmentId' }

    if(!utils.isObjectId(assignmentId)) return { isAccepted: false, message: 'Assignment ID format is invalid', field: 'assignmentId' }

    if(score && typeof score != 'number') return { isAccepted: false, message: 'Score format is invalid', field: 'score' }

    if(!submissionDate) return { isAccepted: false, message: 'SubmissionDate is required', field: 'submissionDate' }

    if(!utils.isDateValid(submissionDate)) return { isAccepted: false, message: 'Submission date format is invalid', field: 'submissionDate' }

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.SUBMISSION_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    
    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }

    return { isAccepted: true, message: 'data is valid', data: submissionData }
}

const updateSubmission = (submissionData) => {

    const { score, submissionDate, status, note } = submissionData

    if(score && typeof score != 'number') return { isAccepted: false, message: 'Score format is invalid', field: 'score' }

    if(submissionDate && !utils.isDateValid(submissionDate)) return { isAccepted: false, message: 'Submission date format is invalid', field: 'submissionDate' }

    if(status && !config.SUBMISSION_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    
    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }

    return { isAccepted: true, message: 'data is valid', data: submissionData }
}

const updateSubmissionStatus = (submissionData) => {

    const { status } = submissionData

    if(!status) return { isAccepted: false, message: 'status is required', field: 'status' }

    if(!config.SUBMISSION_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }
    
    return { isAccepted: true, message: 'data is valid', data: submissionData }
}

const updateSubmissionURL = (submissionData) => {

    const { url } = submissionData

    if(!url) return { isAccepted: false, message: 'URL is required', field: 'url' }

    if(!utils.isValidURL(url)) return { isAccepted: false, message: 'URL format is invalid', field: 'url' }

    return { isAccepted: true, message: 'data is valid', data: submissionData }
}

module.exports = { addSubmission, updateSubmission, updateSubmissionURL, updateSubmissionStatus }