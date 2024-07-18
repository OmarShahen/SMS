

const addSupplier = (supplierData) => {

    const { name, phone, note } = supplierData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'string') return { isAccepted: false, message: 'Invalid phone format', field: 'phone' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'Invalid note format', field: 'note' }


    return { isAccepted: true, message: 'data is valid', data: supplierData }
}

const updateSupplier = (supplierData) => {

    const { name, phone, note } = supplierData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'string') return { isAccepted: false, message: 'Invalid phone format', field: 'phone' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'Invalid note format', field: 'note' }


    return { isAccepted: true, message: 'data is valid', data: supplierData }
}


module.exports = { addSupplier, updateSupplier }