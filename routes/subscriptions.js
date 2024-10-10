const router = require('express').Router()
const subscriptionsController = require('../controllers/subscriptions')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifySubscriptionId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/subscriptions/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => subscriptionsController.getUserSubscriptions(request, response)
)

router.post(
    '/v1/subscriptions',
    authorization.allPermission,
    (request, response) => subscriptionsController.addSubscription(request, response)
)

router.patch(
    '/v1/subscriptions/:subscriptionId/status',
    authorization.allPermission,
    verifySubscriptionId,
    (request, response) => subscriptionsController.updateSubscriptionStatus(request, response)
)

router.delete(
    '/v1/subscriptions/:subscriptionId',
    authorization.allPermission,
    verifySubscriptionId,
    (request, response) => subscriptionsController.deleteSubscription(request, response)
)

module.exports = router