const utils = require('../utils/utils')


const addSpecialization = (specializationData) => {

    const { userId, name } = specializationData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    return { isAccepted: true, message: 'data is valid', data: specializationData }
}


const updateSpecialization = (specializationData) => {

    const { name } = specializationData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    return { isAccepted: true, message: 'data is valid', data: specializationData }
}


module.exports = { addSpecialization, updateSpecialization }