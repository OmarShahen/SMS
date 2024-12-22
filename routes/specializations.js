const router = require('express').Router()
const specializationsController = require('../controllers/specializations')
const { verifyUserId, verifySpecializationId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/specializations/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => specializationsController.getUserSpecializations(request, response)
)

router.post(
    '/v1/specializations',
    authorization.allPermission,
    (request, response) => specializationsController.addSpecialization(request, response)
)

router.put(
    '/v1/specializations/:specializationId',
    authorization.allPermission,
    verifySpecializationId,
    (request, response) => specializationsController.updateSpecialization(request, response)
)

router.delete(
    '/v1/specializations/:specializationId',
    authorization.allPermission,
    verifySpecializationId,
    (request, response) => specializationsController.deleteSpecialization(request, response)
)

module.exports = router