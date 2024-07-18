const router = require('express').Router()
const itemsController = require('../controllers/items')
const authorization = require('../middlewares/verify-permission')
const { verifyItemId, verifySpecialityId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/items',
    authorization.allPermission,
    (request, response) => itemsController.getItems(request, response)
)

router.get(
    '/v1/all/items',
    authorization.allPermission,
    (request, response) => itemsController.getAllItems(request, response)
)

router.get(
    '/v1/items/:itemId',
    verifyItemId,
    (request, response) => itemsController.getItem(request, response)
)

router.get(
    '/v1/items/numeric/:itemId',
    authorization.allPermission,
    (request, response) => itemsController.getItemByNumericId(request, response)
)

router.get(
    '/v1/items/barcode/:barcode',
    authorization.allPermission,
    (request, response) => itemsController.getItemByBarcode(request, response)
)

router.get(
    '/v1/items/search/name/category',
    authorization.allPermission,
    (request, response) => itemsController.searchItemsByNameAndCategory(request, response)
)

router.get(
    '/v1/items/search/barcode',
    authorization.allPermission,
    (request, response) => itemsController.searchItemsByBarcode(request, response)
)

router.get(
    '/v1/items/categories/:specialityId',
    authorization.allPermission,
    verifySpecialityId,
    (request, response) => itemsController.searchItemsByCategory(request, response)
)


router.post(
    '/v1/items',
    authorization.allPermission,
    (request, response) => itemsController.addItem(request, response)
)

router.put(
    '/v1/items/:itemId',
    authorization.allPermission,
    verifyItemId,
    (request, response) => itemsController.updateItem(request, response)
)

router.delete(
    '/v1/items/:itemId',
    authorization.allPermission,
    verifyItemId,
    (request, response) => itemsController.deleteItem(request, response)
)

router.patch(
    '/v1/items/:itemId/image-url',
    authorization.allPermission,
    verifyItemId,
    (request, response) => itemsController.updateItemImageURL(request, response)
)

router.get(
    '/v1/analytics/items/growth',
    authorization.allPermission,
    (request, response) => itemsController.getItemsGrowthStats(request, response)
)


module.exports = router