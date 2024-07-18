const SupplierModel = require('../models/SupplierModel')
const CounterModel = require('../models/CounterModel')
const supplierValidation = require('../validations/suppliers')


const getSuppliers = async (request, response) => {

    try {

        let { name, phone, note } = request.query

        name = name ? name: ''
        phone = phone ? phone: ''
        note = note ? note: ''

        const searchQuery = name || phone || note ? { $or: [] } : {}

        if(name) {
            searchQuery.$or.push({ name: { $regex: name, $options: 'i' } })
        }

        if(phone) {
            searchQuery.$or.push({ phone: { $regex: phone, $options: 'i' } })
        }

        if(note) {
            searchQuery.$or.push({ note: { $regex: note, $options: 'i' } })
        }

        const suppliers = await SupplierModel
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(25)

        return response.status(200).json({
            accepted: true,
            suppliers
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const addSupplier = async (request, response) => {

    try {

        const dataValidation = supplierValidation.addSupplier(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, phone } = request.body

        const totalNames = await SupplierModel.countDocuments({ name })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم المورد مسجل مسبقا',
                field: 'name'
            })
        }

        const totalPhones = await SupplierModel.countDocuments({ phone })
        if(totalPhones != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'رقم المورد مسجل مسبقا',
                field: 'phone'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'supplier' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const supplierData = { supplierId: counter.value, ...request.body }
        const supplierObj = new SupplierModel(supplierData)
        const newSupplier = await supplierObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة مورد بنجاح',
            supplier: newSupplier
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateSupplier = async (request, response) => {

    try {

        const dataValidation = supplierValidation.updateSupplier(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { supplierId } = request.params

        const supplier = await SupplierModel.findById(supplierId)

        const { name, phone } = request.body

        if(supplier.name != name) {
            const totalNames = await SupplierModel.countDocuments({ name })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم المورد مسجل مسبقا',
                    field: 'name'
                })
            }
        }

        if(supplier.phone != phone) {
            const totalPhones = await SupplierModel.countDocuments({ phone })
            if(totalPhones != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'رقم المورد مسجل مسبقا',
                    field: 'phone'
                })
            }
        }

        const updatedSupplier = await SupplierModel
        .findByIdAndUpdate(supplierId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث مورد بنجاح',
            supplier: updatedSupplier
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteSupplier = async (request, response) => {

    try {

        const { supplierId } = request.params

        const deletedSupplier = await SupplierModel.findByIdAndDelete(supplierId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح المورد بنجاح',
            supplier: deletedSupplier
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { getSuppliers, addSupplier, updateSupplier, deleteSupplier }