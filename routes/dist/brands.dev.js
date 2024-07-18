"use strict";

var router = require('express').Router();

var brandsController = require('../controllers/brands');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyBrandId = _require.verifyBrandId,
    verifySpecialityId = _require.verifySpecialityId;

router.get('/v1/brands', authorization.allPermission, function (request, response) {
  return brandsController.getBrands(request, response);
});
router.get('/v1/brands/categories/:specialityId', verifySpecialityId, function (request, response) {
  return brandsController.getBrandsByCategoryId(request, response);
});
router.post('/v1/brands', authorization.allPermission, function (request, response) {
  return brandsController.addBrand(request, response);
});
router["delete"]('/v1/brands/:brandId', authorization.allPermission, verifyBrandId, function (request, response) {
  return brandsController.deleteBrand(request, response);
});
router.put('/v1/brands/:brandId', authorization.allPermission, verifyBrandId, function (request, response) {
  return brandsController.updateBrand(request, response);
});
module.exports = router;