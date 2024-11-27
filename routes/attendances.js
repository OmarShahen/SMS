const router = require('express').Router()
const attendancesController = require('../controllers/attendances')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyAttendanceId, verifyShiftId, verifyStudentId, verifySubscriptionId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/attendances/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => attendancesController.getUserAttendances(request, response)
)

router.get(
    '/v1/attendances/shifts/:shiftId',
    authorization.allPermission,
    verifyShiftId,
    (request, response) => attendancesController.getStudentsThatAttendedInShift(request, response)
)

router.post(
    '/v1/attendances',
    authorization.allPermission,
    (request, response) => attendancesController.addAttendance(request, response)
)

router.post(
    '/v1/attendances/subscriptions/:subscriptionId',
    authorization.allPermission,
    verifySubscriptionId,
    (request, response) => attendancesController.addAttendanceBySubscriptionId(request, response)
)

router.patch(
    '/v1/attendances/:attendanceId/status',
    authorization.allPermission,
    verifyAttendanceId,
    (request, response) => attendancesController.updateAttendanceStatus(request, response)
)

router.patch(
    '/v1/attendances/students/:studentId/shifts/:shiftId/status',
    authorization.allPermission,
    verifyStudentId,
    verifyShiftId,
    (request, response) => attendancesController.updateAttendanceStatusByStudentIdAndShiftId(request, response)
)

router.delete(
    '/v1/attendances/:attendanceId',
    authorization.allPermission,
    verifyAttendanceId,
    (request, response) => attendancesController.deleteAttendance(request, response)
)

module.exports = router