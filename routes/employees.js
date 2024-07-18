const router = require('express').Router()
const employeesController = require('../controllers/employees')
const { verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.put(
    '/v1/employees/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => employeesController.updateEmployee(request, response)
)

router.post(
    '/v1/employees',
    authorization.allPermission,
    (request, response) => employeesController.addEmployee(request, response)
)

router.get(
    '/v1/employees',
    authorization.allPermission,
    (request, response) => employeesController.getEmployees(request, response)
)

router.get(
    '/v1/employees/name/search',
    authorization.allPermission,
    (request, response) => employeesController.searchEmployeesByName(request, response)
)

router.delete(
    '/v1/employees/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => employeesController.deleteEmployee(request, response)
)

router.patch(
    '/v1/employees/:userId/blocked',
    authorization.allPermission,
    verifyUserId,
    (request, response) => employeesController.updateEmployeeBlock(request, response)
)


module.exports = router