const router = require('express').Router()
const assignmentsController = require('../controllers/assignments')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyAssignmentId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/assignments/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => assignmentsController.getUserAssignments(request, response)
)

router.post(
    '/v1/assignments',
    authorization.allPermission,
    (request, response) => assignmentsController.addAssignment(request, response)
)

router.put(
    '/v1/assignments/:assignmentId',
    authorization.allPermission,
    verifyAssignmentId,
    (request, response) => assignmentsController.updateAssignment(request, response)
)

router.patch(
    '/v1/assignments/:assignmentId/url',
    authorization.allPermission,
    verifyAssignmentId,
    (request, response) => assignmentsController.updateAssignmentURL(request, response)
)

router.delete(
    '/v1/assignments/:assignmentId',
    authorization.allPermission,
    verifyAssignmentId,
    (request, response) => assignmentsController.deleteAssignment(request, response)
)


module.exports = router