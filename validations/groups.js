const utils = require('../utils/utils')
const config = require('../config/config')

const addGroup = (groupData) => {

    const { userId, teacherId, courseId, name, description, isActive, academicYear, supportPhone, capacity, address, addressLink, whatsappLink } = groupData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(teacherId && !utils.isObjectId(teacherId)) return { isAccepted: false, message: 'Teacher ID format is invalid', field: 'teacherId' }

    if(courseId && !utils.isObjectId(courseId)) return { isAccepted: false, message: 'Course ID format is invalid', field: 'courseId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(supportPhone && typeof supportPhone != 'string') return { isAccepted: false, message: 'Support phone format is invalid', field: 'supportPhone' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(capacity && typeof capacity != 'number') return { isAccepted: false, message: 'Capacity format is invalid', field: 'capacity' }

    if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

    if(addressLink && typeof addressLink != 'string') return { isAccepted: false, message: 'Address link format is invalid', field: 'addressLink' }

    if(whatsappLink && typeof whatsappLink != 'string') return { isAccepted: false, message: 'Whats app link format is invalid', field: 'whatsappLink' }


    return { isAccepted: true, message: 'data is valid', data: groupData }
}

const updateGroup = (groupData) => {

    const { name, description, isActive, capacity, supportPhone, address, addressLink, whatsappLink } = groupData

    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(capacity && typeof capacity != 'number') return { isAccepted: false, message: 'Capacity format is invalid', field: 'capacity' }

    if(supportPhone && typeof supportPhone != 'string') return { isAccepted: false, message: 'Support phone format is invalid', field: 'supportPhone' }

    if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

    if(addressLink && typeof addressLink != 'string') return { isAccepted: false, message: 'Address link format is invalid', field: 'addressLink' }

    if(whatsappLink && typeof whatsappLink != 'string') return { isAccepted: false, message: 'Whats app link format is invalid', field: 'whatsappLink' }


    return { isAccepted: true, message: 'data is valid', data: groupData }
}


module.exports = { addGroup, updateGroup }