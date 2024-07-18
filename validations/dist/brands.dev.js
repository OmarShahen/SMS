"use strict";

var utils = require('../utils/utils');

var addBrand = function addBrand(brandData) {
  var categoryId = brandData.categoryId,
      name = brandData.name;
  if (!categoryId) return {
    isAccepted: false,
    message: 'Category Id is required',
    field: 'categoryId'
  };
  if (!utils.isObjectId(categoryId)) return {
    isAccepted: false,
    message: 'Category Id format is invalid',
    field: 'categoryId'
  };
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: brandData
  };
};

var updateBrand = function updateBrand(brandData) {
  var name = brandData.name;
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: brandData
  };
};

module.exports = {
  addBrand: addBrand,
  updateBrand: updateBrand
};