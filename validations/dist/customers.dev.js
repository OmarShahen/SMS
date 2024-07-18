"use strict";

var utils = require('../utils/utils');

var addCustomer = function addCustomer(customerData) {
  var name = customerData.name,
      phone = customerData.phone;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (typeof phone != 'string') return {
    isAccepted: false,
    message: 'Invalid phone format',
    field: 'phone'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: customerData
  };
};

var updateCustomer = function updateCustomer(customerData) {
  var name = customerData.name,
      phone = customerData.phone;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (typeof phone != 'string') return {
    isAccepted: false,
    message: 'Invalid phone format',
    field: 'phone'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: customerData
  };
};

module.exports = {
  addCustomer: addCustomer,
  updateCustomer: updateCustomer
};