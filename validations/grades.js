const utils = require('../utils/utils')


const addGrade = (gradeData) => {

    const { userId, studentId, examId, correctorId, teacherId, courseId, score, note } = gradeData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!studentId) return { isAccepted: false, message: 'Student ID is required', field: 'studentId' }

    if(!utils.isObjectId(studentId)) return { isAccepted: false, message: 'Student ID format is invalid', field: 'studentId' }

    if(!examId) return { isAccepted: false, message: 'Exam ID is required', field: 'examId' }

    if(!utils.isObjectId(examId)) return { isAccepted: false, message: 'Exam ID format is invalid', field: 'examId' }

    if(!correctorId) return { isAccepted: false, message: 'Corrector ID is required', field: 'correctorId' }

    if(!utils.isObjectId(correctorId)) return { isAccepted: false, message: 'Corrector ID format is invalid', field: 'correctorId' }

    if(teacherId && !utils.isObjectId(teacherId)) return { isAccepted: false, message: 'Teacher ID format is invalid', field: 'teacherId' }

    if(courseId && !utils.isObjectId(courseId)) return { isAccepted: false, message: 'Course ID format is invalid', field: 'courseId' }

    if(!score) return { isAccepted: false, message: 'Score is required', field: 'score' }

    if(typeof score != 'number') return { isAccepted: false, message: 'Score format is invalid', field: 'score' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }

    return { isAccepted: true, message: 'data is valid', data: gradeData }
}

const updateGrade = (gradeData) => {

    const { score, note } = gradeData

    if(!score) return { isAccepted: false, message: 'Score is required', field: 'score' }

    if(typeof score != 'number') return { isAccepted: false, message: 'Score format is invalid', field: 'score' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }

    return { isAccepted: true, message: 'data is valid', data: gradeData }
}


module.exports = { addGrade, updateGrade }