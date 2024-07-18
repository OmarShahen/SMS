const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({

    orderId: { type: mongoose.Types.ObjectId, required: true },
    itemId: { type: mongoose.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }

}, { timestamps: true })

module.exports = mongoose.model('OrderItem', OrderItemSchema)