"use strict";

var router = require('express').Router();

var customersController = require('../controllers/customers');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyCustomerId = _require.verifyCustomerId;

router.get('/v1/customers', authorization.allPermission, function (request, response) {
  return customersController.getCustomers(request, response);
});
router.get('/v1/customers/:customerId', authorization.allPermission, verifyCustomerId, function (request, response) {
  return customersController.getCustomer(request, response);
});
router.get('/v1/customers/search/name/phone', authorization.allPermission, function (request, response) {
  return customersController.searchCustomersByNameAndPhone(request, response);
});
router.post('/v1/customers', authorization.allPermission, function (request, response) {
  return customersController.addCustomer(request, response);
});
router["delete"]('/v1/customers/:customerId', authorization.allPermission, verifyCustomerId, function (request, response) {
  return customersController.deleteCustomer(request, response);
});
router.put('/v1/customers/:customerId', authorization.allPermission, verifyCustomerId, function (request, response) {
  return customersController.updateCustomer(request, response);
});
router.get('/v1/analytics/customers/growth', authorization.allPermission, function (request, response) {
  return customersController.getCustomersGrowthStats(request, response);
});
module.exports = router;