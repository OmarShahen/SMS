const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({

    itemId: { type: Number, required: true, unique: true },
    categoryId: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    imageURL: { type: String },
    price: { type: Number, default: 0 },
    barcode: { type: String },
    stock: { type: Number, default: 0, min: 0 },

}, { timestamps: true })

module.exports = mongoose.model('Item', ItemSchema)