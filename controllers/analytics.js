const OrderModel = require('../models/OrderModel')
const utils = require('../utils/utils')


const getOverviewAnalytics = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const totalOrders = await OrderModel
        .countDocuments({ ...searchQuery, isPaid: true, isRefunded: false })

        const totalPriceList = await OrderModel.aggregate([
            {
                $match: { ...searchQuery, isPaid: true, isRefunded: false }
            },
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: '$totalPrice' }
                }
            }
        ])

        const totalQuantityList = await OrderModel.aggregate([
            {
                $match: { ...searchQuery, isPaid: true, isRefunded: false }
            },
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$items.quantity' }
                }
            }
        ])

        const totalPaid = totalPriceList.length == 0 ? 0 : totalPriceList[0].totalPaid
        const totalQuantity = totalQuantityList.length > 0 ? totalQuantityList[0].totalQuantity : 0

        return response.status(200).json({
            accepted: true,
            totalQuantity,
            totalOrders,
            totalPaid
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

module.exports = { 
    getOverviewAnalytics, 
}