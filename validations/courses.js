const utils = require('../utils/utils')


const addCourse = (courseData) => {

    const { userId, teacherId, specializationId, name, description, price } = courseData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!teacherId) return { isAccepted: false, message: 'Teacher ID is required', field: 'teacherId' }

    if(!utils.isObjectId(teacherId)) return { isAccepted: false, message: 'Teacher ID format is invalid', field: 'teacherId' }

    if(!specializationId) return { isAccepted: false, message: 'Specialization ID is required', field: 'specializationId' }

    if(!utils.isObjectId(specializationId)) return { isAccepted: false, message: 'Specialization ID format is invalid', field: 'specializationId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(price && typeof price != 'number') return { isAccepted: false, message: 'Price format is invalid', field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: courseData }
}

const updateCourse = (courseData) => {

    const { name, description, price } = courseData

    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(price && typeof price != 'number') return { isAccepted: false, message: 'Price format is invalid', field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: courseData }
}


module.exports = { addCourse, updateCourse }