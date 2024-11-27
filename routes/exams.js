const router = require('express').Router()
const examsController = require('../controllers/exams')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyExamId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/exams/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => examsController.getUserExams(request, response)
)

router.get(
    '/v1/exams/:examId',
    authorization.allPermission,
    verifyExamId,
    (request, response) => examsController.getExam(request, response)
)

router.post(
    '/v1/exams',
    authorization.allPermission,
    (request, response) => examsController.addExam(request, response)
)

router.put(
    '/v1/exams/:examId',
    authorization.allPermission,
    verifyExamId,
    (request, response) => examsController.updateExam(request, response)
)

router.patch(
    '/v1/exams/:examId/url',
    authorization.allPermission,
    verifyExamId,
    (request, response) => examsController.updateExamURL(request, response)
)

router.patch(
    '/v1/exams/:examId/answered-url',
    authorization.allPermission,
    verifyExamId,
    (request, response) => examsController.updateExamAnswerURL(request, response)
)

router.delete(
    '/v1/exams/:examId',
    authorization.allPermission,
    verifyExamId,
    (request, response) => examsController.deleteExam(request, response)
)

module.exports = router