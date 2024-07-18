const utils = require('../utils/utils')


const addBrand = (brandData) => {

    const { categoryId, name } = brandData

    if(!categoryId) return { isAccepted: false, message: 'Category Id is required', field: 'categoryId' }

    if(!utils.isObjectId(categoryId)) return { isAccepted: false, message: 'Category Id format is invalid', field: 'categoryId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }


    return { isAccepted: true, message: 'data is valid', data: brandData }
}

const updateBrand = (brandData) => {

    const { name } = brandData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }


    return { isAccepted: true, message: 'data is valid', data: brandData }
}


module.exports = { addBrand, updateBrand }