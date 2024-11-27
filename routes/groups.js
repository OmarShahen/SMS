const router = require('express').Router()
const groupsController = require('../controllers/groups')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyGroupId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/groups/users/:userId',
    //authorization.allPermission,
    verifyUserId,
    (request, response) => groupsController.getUserGroups(request, response)
)

router.post(
    '/v1/groups',
    authorization.allPermission,
    (request, response) => groupsController.addGroup(request, response)
)

router.put(
    '/v1/groups/:groupId',
    authorization.allPermission,
    verifyGroupId,
    (request, response) => groupsController.updateGroup(request, response)
)

router.delete(
    '/v1/groups/:groupId',
    authorization.allPermission,
    verifyGroupId,
    (request, response) => groupsController.deleteGroup(request, response)
)

router.get(
    '/v1/groups/:groupId',
    authorization.allPermission,
    verifyGroupId,
    (request, response) => groupsController.getGroup(request, response)
)

module.exports = router