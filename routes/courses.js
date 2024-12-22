const router = require('express').Router()
const coursesController = require('../controllers/courses')
const { verifyUserId, verifyCourseId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/courses/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => coursesController.getUserCourses(request, response)
)

router.post(
    '/v1/courses',
    authorization.allPermission,
    (request, response) => coursesController.addCourse(request, response)
)

router.put(
    '/v1/courses/:courseId',
    authorization.allPermission,
    verifyCourseId,
    (request, response) => coursesController.updateCourse(request, response)
)

router.delete(
    '/v1/courses/:courseId',
    authorization.allPermission,
    verifyCourseId,
    (request, response) => coursesController.deleteCourse(request, response)
)

module.exports = router