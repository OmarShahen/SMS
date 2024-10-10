const router = require('express').Router()
const gradesController = require('../controllers/grades')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyGradeId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/grades/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => gradesController.getUserGrades(request, response)
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

router.delete(
    '/v1/grades/:gradeId',
    authorization.allPermission,
    verifyGradeId,
    (request, response) => gradesController.deleteGrade(request, response)
)


module.exports = router