const router = require('express').Router()
const gradesController = require('../controllers/grades')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyGradeId, verifyExamId, verifyStudentId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/grades/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => gradesController.getUserGrades(request, response)
)

router.get(
    '/v1/grades/exams/:examId',
    authorization.allPermission,
    verifyExamId,
    (request, response) => gradesController.getStudentsThatAreGraded(request, response)
)

router.post(
    '/v1/grades',
    authorization.allPermission,
    (request, response) => gradesController.addGrade(request, response)
)

router.put(
    '/v1/grades/:gradeId',
    authorization.allPermission,
    verifyGradeId,
    (request, response) => gradesController.updateGrade(request, response)
)

router.put(
    '/v1/grades/students/:studentId/exams/:examId',
    authorization.allPermission,
    verifyStudentId,
    verifyExamId,
    (request, response) => gradesController.updateGradeByStudentIdAndExamId(request, response)
)

router.delete(
    '/v1/grades/:gradeId',
    authorization.allPermission,
    verifyGradeId,
    (request, response) => gradesController.deleteGrade(request, response)
)

router.post(
    '/v1/grades/:gradeId/notify',
    authorization.allPermission,
    verifyGradeId,
    (request, response) => gradesController.notifyGrade(request, response)
)

module.exports = router