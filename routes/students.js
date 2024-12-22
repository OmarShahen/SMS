const router = require('express').Router()
const studentsController = require('../controllers/students')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId, verifyStudentId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/students/users/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => studentsController.getUserStudents(request, response)
)

router.get(
    '/v1/students/QR-code-UUID/:QRCodeUUID',
    authorization.allPermission,
    (request, response) => studentsController.getStudentByQRCodeUUID(request, response)
)

router.post(
    '/v1/students',
    //authorization.allPermission,
    (request, response) => studentsController.addStudent(request, response)
)

router.put(
    '/v1/students/:studentId',
    authorization.allPermission,
    verifyStudentId,
    (request, response) => studentsController.updateStudent(request, response)
)

router.delete(
    '/v1/students/:studentId',
    authorization.allPermission,
    verifyStudentId,
    (request, response) => studentsController.deleteStudent(request, response)
)

router.patch(
    '/v1/students/:studentId/telegram-ID',
    authorization.allPermission,
    verifyStudentId,
    (request, response) => studentsController.removeTelegramID(request, response)
)

router.patch(
    '/v1/students/:studentId/QR-code-UUID',
    authorization.allPermission,
    verifyStudentId,
    (request, response) => studentsController.createNewQRCodeUUID(request, response)
)

module.exports = router