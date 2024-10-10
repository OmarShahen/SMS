const utils = require('../utils/utils')
const config = require('../config/config')

const addGroup = (groupData) => {

    const { userId, name, description, isActive, academicYear, capacity, address, addressLink } = groupData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(capacity && typeof capacity != 'number') return { isAccepted: false, message: 'Capacity format is invalid', field: 'capacity' }

    if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

    if(addressLink && typeof addressLink != 'string') return { isAccepted: false, message: 'Address link format is invalid', field: 'addressLink' }


    return { isAccepted: true, message: 'data is valid', data: groupData }
}

const updateGroup = (groupData) => {

    const { name, description, isActive, capacity, address, addressLink } = groupData

    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(capacity && typeof capacity != 'number') return { isAccepted: false, message: 'Capacity format is invalid', field: 'capacity' }

    if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

    if(addressLink && typeof addressLink != 'string') return { isAccepted: false, message: 'Address link format is invalid', field: 'addressLink' }


    return { isAccepted: true, message: 'data is valid', data: groupData }
}


module.exports = { addGroup, updateGroup }