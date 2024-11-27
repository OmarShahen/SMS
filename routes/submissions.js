const router = require('express').Router()
const submissionsController = require('../controllers/submissions')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifySubmissionId, verifyAssignmentId, verifyStudentId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/submissions/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => submissionsController.getUserSubmissions(request, response)
)

router.get(
    '/v1/submissions/assignments/:assignmentId',
    authorization.allPermission,
    verifyAssignmentId,
    (request, response) => submissionsController.getStudentsThatSubmittedAssignment(request, response)
)

router.patch(
    '/v1/submissions/students/:studentId/assignments/:assignmentId/status',
    authorization.allPermission,
    verifyStudentId,
    verifyAssignmentId,
    (request, response) => submissionsController.updateSubmissionStatusByStudentIdAndAssignmentId(request, response)
)

router.post(
    '/v1/submissions',
    authorization.allPermission,
    (request, response) => submissionsController.addSubmission(request, response)
)

router.put(
    '/v1/submissions/:submissionId',
    authorization.allPermission,
    verifySubmissionId,
    (request, response) => submissionsController.updateSubmission(request, response)
)

router.patch(
    '/v1/submissions/:submissionId/url',
    authorization.allPermission,
    verifySubmissionId,
    (request, response) => submissionsController.updateSubmissionURL(request, response)
)

router.delete(
    '/v1/submissions/:submissionId',
    authorization.allPermission,
    verifySubmissionId,
    (request, response) => submissionsController.deleteSubmission(request, response)
)

module.exports = router