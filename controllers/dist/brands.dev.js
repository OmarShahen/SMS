"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BrandModel = require('../models/BrandModel');

var SpecialityModel = require('../models/SpecialityModel');

var CounterModel = require('../models/CounterModel');

var brandValidation = require('../validations/brands');

var getBrands = function getBrands(request, response) {
  var brands;
  return regeneratorRuntime.async(function getBrands$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(BrandModel.aggregate([{
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 20
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          }]));

        case 3:
          brands = _context.sent;
          brands.forEach(function (brand) {
            return brand.category = brand.category[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            brands: brands
          }));

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getBrandsByCategoryId = function getBrandsByCategoryId(request, response) {
  var specialityId, brands;
  return regeneratorRuntime.async(function getBrandsByCategoryId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          specialityId = request.params.specialityId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(BrandModel.find({
            categoryId: specialityId
          }));

        case 4:
          brands = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            brands: brands
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

var addBrand = function addBrand(request, response) {
  var dataValidation, _request$body, name, categoryId, category, totalCategories, counter, brandData, brandObj, newBrand;

  return regeneratorRuntime.async(function addBrand$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = brandValidation.addBrand(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, name = _request$body.name, categoryId = _request$body.categoryId;
          _context3.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.findById(categoryId));

        case 7:
          category = _context3.sent;

          if (category) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Category ID is not registered',
            field: 'categoryId'
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(BrandModel.countDocuments({
            name: name,
            categoryId: categoryId
          }));

        case 12:
          totalCategories = _context3.sent;

          if (!(totalCategories != 0)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Name is already registered',
            field: 'categoryId'
          }));

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'brand'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 17:
          counter = _context3.sent;
          brandData = _objectSpread({
            brandId: counter.value
          }, request.body);
          brandObj = new BrandModel(brandData);
          _context3.next = 22;
          return regeneratorRuntime.awrap(brandObj.save());

        case 22:
          newBrand = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added new brand successfully!',
            brand: newBrand
          }));

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

var deleteBrand = function deleteBrand(request, response) {
  var brandId, deletedBrand;
  return regeneratorRuntime.async(function deleteBrand$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          brandId = request.params.brandId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(BrandModel.findByIdAndDelete(brandId));

        case 4:
          deletedBrand = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted brand successfully!',
            brand: deletedBrand
          }));

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var updateBrand = function updateBrand(request, response) {
  var dataValidation, brandId, name, brand, totalBrandsNames, updatedBrand;
  return regeneratorRuntime.async(function updateBrand$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = brandValidation.updateBrand(request.body);

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
          brandId = request.params.brandId;
          name = request.body.name;
          _context5.next = 8;
          return regeneratorRuntime.awrap(BrandModel.findById(brandId));

        case 8:
          brand = _context5.sent;

          if (!(brand.name != name)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(BrandModel.countDocuments({
            name: name,
            categoryId: brand.categoryId
          }));

        case 12:
          totalBrandsNames = _context5.sent;

          if (!(totalBrandsNames != 0)) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Name is already registered',
            field: 'name'
          }));

        case 15:
          _context5.next = 17;
          return regeneratorRuntime.awrap(BrandModel.findByIdAndUpdate(brandId, request.body, {
            "new": true
          }));

        case 17:
          updatedBrand = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated brand successfully!',
            brand: updatedBrand
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

module.exports = {
  getBrands: getBrands,
  getBrandsByCategoryId: getBrandsByCategoryId,
  addBrand: addBrand,
  deleteBrand: deleteBrand,
  updateBrand: updateBrand
};