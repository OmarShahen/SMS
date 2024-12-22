const router = require('express').Router()
const teachersController = require('../controllers/teachers')
const { verifyUserId, verifyTeacherId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/teachers/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => teachersController.getUserTeachers(request, response)
)

router.post(
    '/v1/teachers',
    authorization.allPermission,
    (request, response) => teachersController.addTeacher(request, response)
)

router.put(
    '/v1/teachers/:teacherId',
    authorization.allPermission,
    verifyTeacherId,
    (request, response) => teachersController.updateTeacher(request, response)
)

router.delete(
    '/v1/teachers/:teacherId',
    authorization.allPermission,
    verifyTeacherId,
    (request, response) => teachersController.deleteTeacher(request, response)
)

module.exports = router