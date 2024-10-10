const utils = require('../utils/utils')
const config = require('../config/config')

const addExam = (examData) => {

    const { userId, name, types, subtypes, description, isActive, academicYear, duration, totalMarks, date } = examData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(!Array.isArray(types)) return { isAccepted: false, message: 'Types format is invalid', field: 'types' }

    if(!utils.isValidTypes(types)) return { isAccepted: false, message: 'Types value is invalid', field: 'types' }

    if(!Array.isArray(subtypes)) return { isAccepted: false, message: 'Subtypes format is invalid', field: 'subtypes' }

    if(!utils.isValidSubtypes(subtypes)) return { isAccepted: false, message: 'Subtypes value is invalid', field: 'subtypes' }

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

    const { name, types, subtypes, description, isActive, academicYear, duration, totalMarks, date } = examData


    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(types && !Array.isArray(types)) return { isAccepted: false, message: 'Types format is invalid', field: 'types' }

    if(types && !utils.isValidTypes(types)) return { isAccepted: false, message: 'Types value is invalid', field: 'types' }

    if(subtypes && !Array.isArray(subtypes)) return { isAccepted: false, message: 'Subtypes format is invalid', field: 'subtypes' }

    if(subtypes && !utils.isValidSubtypes(subtypes)) return { isAccepted: false, message: 'Subtypes value is invalid', field: 'subtypes' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    //if(academicYear && !config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

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

module.exports = { addExam, updateExam, updateExamURL }