const utils = require('../utils/utils')


const addCustomer = (customerData) => {

    const { name, phone } = customerData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'string') return { isAccepted: false, message: 'Invalid phone format', field: 'phone' }


    return { isAccepted: true, message: 'data is valid', data: customerData }
}

const updateCustomer = (customerData) => {

    const { name, phone } = customerData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'string') return { isAccepted: false, message: 'Invalid phone format', field: 'phone' }


    return { isAccepted: true, message: 'data is valid', data: customerData }
}


module.exports = { addCustomer, updateCustomer }