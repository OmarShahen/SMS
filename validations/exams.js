const utils = require('../utils/utils')
const config = require('../config/config')

const addExam = (examData) => {

    const { userId, groups, name, chapters, type, subtype, description, isActive, academicYear, duration, totalMarks, date } = examData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(!Array.isArray(groups) || groups.length == 0) return { isAccepted: false, message: 'Groups format is invalid', field: 'groups' }

    if(!groups.every(groupId => utils.isObjectId(groupId))) return { isAccepted: false, message: 'Groups value is invalid', field: 'groups' }

    //if(chapters && !Array.isArray(chapters) || chapters.length == 0) return { isAccepted: false, message: 'Chapters format is invalid', field: 'chapters' }

    //if(chapters && !chapters.every(chapter => config.CHAPTERS.includes(chapter))) return { isAccepted: false, message: 'Chapters value is invalid', field: 'chapters' }

    if(type && !config.EXAM_TYPES.includes(type)) return { isAccepted: false, message: 'Type value is invalid', field: 'type' }

    if(subtype && !config.EXAM_SUBTYPES.includes(subtype)) return { isAccepted: false, message: 'Subtype value is invalid', field: 'subtype' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(duration && typeof duration != 'number') return { isAccepted: false, message: 'Duration format is invalid', field: 'duration' }

    if(totalMarks && typeof totalMarks != 'number') return { isAccepted: false, message: 'Total marks format is invalid', field: 'totalMarks' }

    if(date && !utils.isDateTimeValid(date)) return { isAccepted: false, message: 'Date format is invalid', field: 'date' }


    return { isAccepted: true, message: 'data is valid', data: examData }
}

const updateExam = (examData) => {

    const { name, groups, chapters, type, subtype, description, isActive, academicYear, duration, totalMarks, date } = examData


    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(groups && !Array.isArray(groups)) return { isAccepted: false, message: 'Groups format is invalid', field: 'groups' }

    if(groups && !groups.every(groupId => utils.isObjectId(groupId))) return { isAccepted: false, message: 'Groups value is invalid', field: 'groups' }

    //if(chapters && !Array.isArray(chapters)) return { isAccepted: false, message: 'Chapters format is invalid', field: 'chapters' }

    //if(chapters && !chapters.every(chapter => config.CHAPTERS.includes(chapter))) return { isAccepted: false, message: 'Chapters value is invalid', field: 'chapters' }

    if(type && !config.EXAM_TYPES.includes(type)) return { isAccepted: false, message: 'Type value is invalid', field: 'type' }

    if(subtype && !config.EXAM_SUBTYPES.includes(subtype)) return { isAccepted: false, message: 'Subtype value is invalid', field: 'subtype' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(academicYear && !config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(duration && typeof duration != 'number') return { isAccepted: false, message: 'Duration format is invalid', field: 'duration' }

    if(totalMarks && typeof totalMarks != 'number') return { isAccepted: false, message: 'Total marks format is invalid', field: 'totalMarks' }

    if(date && !utils.isDateTimeValid(date)) return { isAccepted: false, message: 'Date format is invalid', field: 'date' }


    return { isAccepted: true, message: 'data is valid', data: examData }
}

const updateExamURL = (examData) => {

    const { url } = examData

    if(!url) return { isAccepted: false, message: 'URL is required', field: 'url' }

    if(!utils.isValidURL(url)) return { isAccepted: false, message: 'URL format is invalid', field: 'url' }

    return { isAccepted: true, message: 'data is valid', data: examData }
}

const updateExamAnswerURL = (examData) => {

    const { answerURL } = examData

    if(!answerURL) return { isAccepted: false, message: 'Answer URL is required', field: 'answerURL' }

    if(!utils.isValidURL(answerURL)) return { isAccepted: false, message: 'Answer URL format is invalid', field: 'answerURL' }

    return { isAccepted: true, message: 'data is valid', data: examData }
}

module.exports = { addExam, updateExam, updateExamURL, updateExamAnswerURL }