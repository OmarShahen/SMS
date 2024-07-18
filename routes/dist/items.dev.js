"use strict";

var router = require('express').Router();

var itemsController = require('../controllers/items');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyItemId = _require.verifyItemId,
    verifySpecialityId = _require.verifySpecialityId,
    verifyCustomerId = _require.verifyCustomerId;

router.get('/v1/items', authorization.allPermission, function (request, response) {
  return itemsController.getItems(request, response);
});
router.get('/v1/items/:itemId', authorization.allPermission, verifyItemId, function (request, response) {
  return itemsController.getItem(request, response);
});
router.get('/v1/items/numeric/:itemId', authorization.allPermission, function (request, response) {
  return itemsController.getItemByNumericId(request, response);
});
router.get('/v1/items/categories/:specialityId', authorization.allPermission, verifySpecialityId, function (request, response) {
  return itemsController.searchItemsByCategory(request, response);
});
router.get('/v1/items/owners/:customerId', authorization.allPermission, verifyCustomerId, function (request, response) {
  return itemsController.getItemsByOwnerId(request, response);
});
router.post('/v1/items', authorization.allPermission, function (request, response) {
  return itemsController.addItem(request, response);
});
router.put('/v1/items/:itemId', authorization.allPermission, verifyItemId, function (request, response) {
  return itemsController.updateItem(request, response);
});
router["delete"]('/v1/items/:itemId', authorization.allPermission, verifyItemId, function (request, response) {
  return itemsController.deleteItem(request, response);
});
router.patch('/v1/items/:itemId/main-image', authorization.allPermission, verifyItemId, function (request, response) {
  return itemsController.updateItemMainImage(request, response);
});
router.post('/v1/items/:itemId/images', authorization.allPermission, verifyItemId, function (request, response) {
  return itemsController.addItemImages(request, response);
});
router.patch('/v1/items/:itemId/images', authorization.allPermission, verifyItemId, function (request, response) {
  return itemsController.removeItemImage(request, response);
});
router.get('/v1/analytics/items/growth', authorization.allPermission, function (request, response) {
  return itemsController.getItemsGrowthStats(request, response);
});
module.exports = router;