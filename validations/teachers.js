const utils = require('../utils/utils')
const config = require('../config/config')

const addTeacher = (teacherData) => {

    const { userId, specializationId, name, title, phone } = teacherData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!specializationId) return { isAccepted: false, message: 'Specialization ID is required', field: 'specializationId' }

    if(!utils.isObjectId(specializationId)) return { isAccepted: false, message: 'Specialization ID format is invalid', field: 'specializationId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(!config.TEACHER_TITLES.includes(title)) return { isAccepted: false, message: 'Title value is invalid', field: 'title' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(!utils.isPhoneValid(phone)) return { isAccepted: false, message: 'الرقم غير صحيح', field: 'phone' }

    return { isAccepted: true, message: 'data is valid', data: teacherData }
}

const updateTeacher = (teacherData) => {

    const { specializationId, name, title, phone } = teacherData

    if(specializationId && !utils.isObjectId(specializationId)) return { isAccepted: false, message: 'Specialization ID format is invalid', field: 'specializationId' }

    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(title && !config.TEACHER_TITLES.includes(title)) return { isAccepted: false, message: 'Title value is invalid', field: 'title' }

    if(phone && !utils.isPhoneValid(phone)) return { isAccepted: false, message: 'الرقم غير صحيح', field: 'phone' }

    return { isAccepted: true, message: 'data is valid', data: teacherData }
}


module.exports = { addTeacher, updateTeacher }