"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CustomerModel = require('../models/CustomerModel');

var CounterModel = require('../models/CounterModel');

var utils = require('../utils/utils');

var customerValidation = require('../validations/customers');

var getCustomers = function getCustomers(request, response) {
  var _utils$statsQueryGene, searchQuery, customers, totalCustomers;

  return regeneratorRuntime.async(function getCustomers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(CustomerModel.find(searchQuery).sort({
            createdAt: -1
          }).limit(20));

        case 4:
          customers = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(CustomerModel.countDocuments(searchQuery));

        case 7:
          totalCustomers = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalCustomers: totalCustomers,
            customers: customers
          }));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getCustomer = function getCustomer(request, response) {
  var customerId, customer;
  return regeneratorRuntime.async(function getCustomer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = request.params.customerId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(CustomerModel.findById(customerId));

        case 4:
          customer = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            customer: customer
          }));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var searchCustomersByNameAndPhone = function searchCustomersByNameAndPhone(request, response) {
  var _request$query, name, phone, customers;

  return regeneratorRuntime.async(function searchCustomersByNameAndPhone$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _request$query = request.query, name = _request$query.name, phone = _request$query.phone;
          name = name ? name : '';
          phone = phone ? phone : '';
          _context3.next = 6;
          return regeneratorRuntime.awrap(CustomerModel.aggregate([{
            $match: {
              $or: [{
                name: {
                  $regex: name,
                  $options: 'i'
                }
              }, {
                phone: {
                  $regex: phone,
                  $options: 'i'
                }
              }]
            }
          }, {
            $limit: 20
          }]));

        case 6:
          customers = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            customers: customers
          }));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var addCustomer = function addCustomer(request, response) {
  var dataValidation, phone, totalCustomersPhones, counter, customerData, customerObj, newCustomer;
  return regeneratorRuntime.async(function addCustomer$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = customerValidation.addCustomer(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          phone = request.body.phone;
          _context4.next = 7;
          return regeneratorRuntime.awrap(CustomerModel.countDocuments({
            phone: phone
          }));

        case 7:
          totalCustomersPhones = _context4.sent;

          if (!(totalCustomersPhones != 0)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Phone number is already registered',
            field: 'phone'
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'customer'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context4.sent;
          customerData = _objectSpread({
            customerId: counter.value
          }, request.body);
          customerObj = new CustomerModel(customerData);
          _context4.next = 17;
          return regeneratorRuntime.awrap(customerObj.save());

        case 17:
          newCustomer = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added customer successfully!',
            customer: newCustomer
          }));

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updateCustomer = function updateCustomer(request, response) {
  var dataValidation, customerId, phone, customer, totalCustomersPhones, updatedCustomer;
  return regeneratorRuntime.async(function updateCustomer$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = customerValidation.updateCustomer(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          customerId = request.params.customerId;
          phone = request.body.phone;
          _context5.next = 8;
          return regeneratorRuntime.awrap(CustomerModel.findById(customerId));

        case 8:
          customer = _context5.sent;

          if (!(customer.phone != phone)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(CustomerModel.countDocuments({
            phone: phone
          }));

        case 12:
          totalCustomersPhones = _context5.sent;

          if (!(totalCustomersPhones != 0)) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Phone number is already registered',
            field: 'phone'
          }));

        case 15:
          _context5.next = 17;
          return regeneratorRuntime.awrap(CustomerModel.findByIdAndUpdate(customerId, request.body, {
            "new": true
          }));

        case 17:
          updatedCustomer = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated customer successfully!',
            customer: updatedCustomer
          }));

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var deleteCustomer = function deleteCustomer(request, response) {
  var customerId, deletedCustomer;
  return regeneratorRuntime.async(function deleteCustomer$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          customerId = request.params.customerId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(CustomerModel.findByIdAndDelete(customerId));

        case 4:
          deletedCustomer = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted customer successfully!',
            customer: deletedCustomer
          }));

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getCustomersGrowthStats = function getCustomersGrowthStats(request, response) {
  var groupBy, format, customersGrowth;
  return regeneratorRuntime.async(function getCustomersGrowthStats$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          groupBy = request.query.groupBy;
          format = '%Y-%m-%d';

          if (groupBy == 'MONTH') {
            format = '%Y-%m';
          } else if (groupBy == 'YEAR') {
            format = '%Y';
          }

          _context7.next = 6;
          return regeneratorRuntime.awrap(CustomerModel.aggregate([{
            $group: {
              _id: {
                $dateToString: {
                  format: format,
                  date: '$createdAt'
                }
              },
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              '_id': 1
            }
          }]));

        case 6:
          customersGrowth = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            customersGrowth: customersGrowth
          }));

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  getCustomers: getCustomers,
  getCustomer: getCustomer,
  searchCustomersByNameAndPhone: searchCustomersByNameAndPhone,
  addCustomer: addCustomer,
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
  getCustomersGrowthStats: getCustomersGrowthStats
};