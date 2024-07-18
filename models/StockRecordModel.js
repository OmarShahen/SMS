const mongoose = require('mongoose')
const config = require('../config/config')


const StockRecordSchema = new mongoose.Schema({

    stockRecordId: { type: Number, required: true, unique: true },
    itemId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: config.TRANSACTION_TYPE },
    effect: { type: String, required: true, enum: ['WIN', 'LOSS'] },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true }

}, { timestamps: true })


module.exports = mongoose.model('StockRecord', StockRecordSchema)