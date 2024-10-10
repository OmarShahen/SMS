const router = require('express').Router()
const shiftsController = require('../controllers/shifts')
const { verifyUserId, verifyShiftId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/shifts/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => shiftsController.getUserShifts(request, response)
)

router.post(
    '/v1/shifts',
    authorization.allPermission,
    (request, response) => shiftsController.addShift(request, response)
)

router.patch(
    '/v1/shifts/:shiftId/close',
    authorization.allPermission,
    verifyShiftId,
    (request, response) => shiftsController.closeShift(request, response)
)

router.delete(
    '/v1/shifts/:shiftId',
    authorization.allPermission,
    verifyShiftId,
    (request, response) => shiftsController.deleteShift(request, response)
)

module.exports = router