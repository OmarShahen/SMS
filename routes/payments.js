const router = require('express').Router()
const paymentsController = require('../controllers/payments')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyPaymentId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/payments/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => paymentsController.getUserPayments(request, response)
)

router.post(
    '/v1/payments',
    authorization.allPermission,
    (request, response) => paymentsController.addPayment(request, response)
)

router.patch(
    '/v1/payments/:paymentId/refund',
    authorization.allPermission,
    verifyPaymentId,
    (request, response) => paymentsController.refundPayment(request, response)
)

router.delete(
    '/v1/payments/:paymentId',
    authorization.allPermission,
    verifyPaymentId,
    (request, response) => paymentsController.deletePayment(request, response)
)

router.get(
    '/v1/analytics/payments/users/:userId/stats',
    authorization.allPermission,
    verifyUserId,
    (request, response) => paymentsController.getUserPaymentsStats(request, response)
)

module.exports = router