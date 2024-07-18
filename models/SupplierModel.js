const mongoose = require('mongoose')

const SupplierSchema = new mongoose.Schema({

    supplierId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    note: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Supplier', SupplierSchema)