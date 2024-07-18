const router = require('express').Router()
const suppliersController = require('../controllers/suppliers')
const { verifySupplierId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/suppliers',
    authorization.allPermission,
    (request, response) => suppliersController.getSuppliers(request, response)
)

router.post(
    '/v1/suppliers',
    authorization.allPermission,
    (request, response) => suppliersController.addSupplier(request, response)
)

router.put(
    '/v1/suppliers/:supplierId',
    authorization.allPermission,
    verifySupplierId,
    (request, response) => suppliersController.updateSupplier(request, response)
)

router.delete(
    '/v1/suppliers/:supplierId',
    authorization.allPermission,
    verifySupplierId,
    (request, response) => suppliersController.deleteSupplier(request, response)
)


module.exports = router