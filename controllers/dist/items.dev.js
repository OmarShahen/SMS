"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ItemModel = require('../models/ItemModel');

var SpecialityModel = require('../models/SpecialityModel');

var CustomerModel = require('../models/CustomerModel');

var BrandModel = require('../models/BrandModel');

var CounterModel = require('../models/CounterModel');

var itemValidation = require('../validations/items');

var utils = require('../utils/utils');

var mongoose = require('mongoose');

var getItems = function getItems(request, response) {
  var _utils$statsQueryGene, searchQuery, items, totalItems;

  return regeneratorRuntime.async(function getItems$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(ItemModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 20
          }, {
            $lookup: {
              from: 'customers',
              localField: 'ownerId',
              foreignField: '_id',
              as: 'owner'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subcategoryId',
              foreignField: '_id',
              as: 'subcategory'
            }
          }, {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          }]));

        case 4:
          items = _context.sent;
          items.forEach(function (item) {
            item.owner = item.owner[0];
            item.category = item.category[0];
            item.subcategory = item.subcategory[0];
            item.brand = item.brand[0];
          });
          _context.next = 8;
          return regeneratorRuntime.awrap(ItemModel.countDocuments(searchQuery));

        case 8:
          totalItems = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            items: items,
            totalItems: totalItems
          }));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getItemsByOwnerId = function getItemsByOwnerId(request, response) {
  var customerId, items, totalItems;
  return regeneratorRuntime.async(function getItemsByOwnerId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = request.params.customerId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ItemModel.aggregate([{
            $match: {
              ownerId: mongoose.Types.ObjectId(customerId)
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 20
          }, {
            $lookup: {
              from: 'customers',
              localField: 'ownerId',
              foreignField: '_id',
              as: 'owner'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subcategoryId',
              foreignField: '_id',
              as: 'subcategory'
            }
          }, {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          }]));

        case 4:
          items = _context2.sent;
          items.forEach(function (item) {
            item.owner = item.owner[0];
            item.category = item.category[0];
            item.subcategory = item.subcategory[0];
            item.brand = item.brand[0];
          });
          _context2.next = 8;
          return regeneratorRuntime.awrap(ItemModel.countDocuments({
            ownerId: mongoose.Types.ObjectId(customerId)
          }));

        case 8:
          totalItems = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            items: items,
            totalItems: totalItems
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getItem = function getItem(request, response) {
  var itemId, itemList, item;
  return regeneratorRuntime.async(function getItem$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          itemId = request.params.itemId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ItemModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(itemId)
            }
          }, {
            $lookup: {
              from: 'customers',
              localField: 'ownerId',
              foreignField: '_id',
              as: 'owner'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subcategoryId',
              foreignField: '_id',
              as: 'subcategory'
            }
          }, {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          }]));

        case 4:
          itemList = _context3.sent;
          itemList.forEach(function (item) {
            item.owner = item.owner[0];
            item.category = item.category[0];
            item.subcategory = item.subcategory[0];
            item.brand = item.brand[0];
          });
          item = itemList[0];
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            item: item
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

var getItemByNumericId = function getItemByNumericId(request, response) {
  var itemId, items;
  return regeneratorRuntime.async(function getItemByNumericId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          itemId = request.params.itemId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ItemModel.aggregate([{
            $match: {
              itemId: Number.parseInt(itemId)
            }
          }, {
            $lookup: {
              from: 'customers',
              localField: 'ownerId',
              foreignField: '_id',
              as: 'owner'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subcategoryId',
              foreignField: '_id',
              as: 'subcategory'
            }
          }, {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          }]));

        case 4:
          items = _context4.sent;
          items.forEach(function (item) {
            item.owner = item.owner[0];
            item.category = item.category[0];
            item.subcategory = item.subcategory[0];
            item.brand = item.brand[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            items: items
          }));

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var searchItemsByCategory = function searchItemsByCategory(request, response) {
  var specialityId, _request$query, page, limit, subcategoryId, brandId, city, fromRentingPrice, untilRentingPrice, fromManufactureYear, untilManufactureYear, fromMileage, untilMileage, condition, fromRunningHours, untilRunningHours, fromEnginePower, untilEnginePower, cabin, suspension, axles, skip, matchQuery, sortQuery, items, totalItems;

  return regeneratorRuntime.async(function searchItemsByCategory$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          specialityId = request.params.specialityId;
          _request$query = request.query, page = _request$query.page, limit = _request$query.limit, subcategoryId = _request$query.subcategoryId, brandId = _request$query.brandId, city = _request$query.city, fromRentingPrice = _request$query.fromRentingPrice, untilRentingPrice = _request$query.untilRentingPrice, fromManufactureYear = _request$query.fromManufactureYear, untilManufactureYear = _request$query.untilManufactureYear, fromMileage = _request$query.fromMileage, untilMileage = _request$query.untilMileage, condition = _request$query.condition, fromRunningHours = _request$query.fromRunningHours, untilRunningHours = _request$query.untilRunningHours, fromEnginePower = _request$query.fromEnginePower, untilEnginePower = _request$query.untilEnginePower, cabin = _request$query.cabin, suspension = _request$query.suspension, axles = _request$query.axles;
          page = page ? page : 1;
          limit = limit ? limit : 10;
          skip = (page - 1) * limit;
          matchQuery = {
            categoryId: mongoose.Types.ObjectId(specialityId)
          };

          if (subcategoryId) {
            matchQuery.subcategoryId = mongoose.Types.ObjectId(subcategoryId);
          }

          if (brandId) {
            matchQuery.brandId = mongoose.Types.ObjectId(brandId);
          }

          if (city) {
            matchQuery.city = city;
          }

          if (condition) {
            matchQuery.condition = condition;
          }

          if (cabin) {
            matchQuery.cabin = cabin;
          }

          if (suspension) {
            matchQuery.suspension = suspension;
          }

          if (axles) {
            matchQuery.axles = axles;
          }

          if (fromRentingPrice && untilRentingPrice) {
            matchQuery.rentingPrice = {
              $gte: fromRentingPrice,
              $lte: untilRentingPrice
            };
          }

          if (fromManufactureYear && untilManufactureYear) {
            matchQuery.manufactureYear = {
              $gte: fromManufactureYear,
              $lte: untilManufactureYear
            };
          }

          if (fromMileage && untilMileage) {
            matchQuery.mileage = {
              $gte: fromMileage,
              $lte: untilMileage
            };
          }

          if (fromRunningHours && untilRunningHours) {
            matchQuery.runningHours = {
              $gte: fromRunningHours,
              $lte: untilRunningHours
            };
          }

          if (fromEnginePower && untilEnginePower) {
            matchQuery.enginePower = {
              $gte: fromEnginePower,
              $lte: untilEnginePower
            };
          }
          /*if(sortBy == 'HIGH-RATING') {
              sortQuery.rating = -1
          } else if(sortBy == 'HIGH-PRICE') {
              sortQuery['pricing.price'] = -1
          } else if(sortBy == 'LOW-PRICE') {
              sortQuery['pricing.price'] = 1
          }*/


          sortQuery = {
            createdAt: -1
          };
          _context5.next = 22;
          return regeneratorRuntime.awrap(ItemModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: sortQuery
          }, {
            $skip: skip
          }, {
            $limit: Number.parseInt(limit)
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subcategoryId',
              foreignField: '_id',
              as: 'subcategory'
            }
          }, {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          }]));

        case 22:
          items = _context5.sent;
          items.forEach(function (item) {
            item.category = item.category[0];
            item.subcategory = item.subcategory[0];
            item.brand = item.brand[0];
          });
          _context5.next = 26;
          return regeneratorRuntime.awrap(ItemModel.countDocuments(matchQuery));

        case 26:
          totalItems = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            totalItems: totalItems,
            items: items
          }));

        case 30:
          _context5.prev = 30;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 34:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var addItem = function addItem(request, response) {
  var dataValidation, _request$body, ownerId, categoryId, subcategoryId, brandId, customerPromise, categoryPromise, subcategoryPromise, brandPromise, _ref, _ref2, customer, category, subcategory, brand, counter, itemData, itemObj, newItem, updatedCategory, updatedSubcategory, updatedBrand;

  return regeneratorRuntime.async(function addItem$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = itemValidation.addItem(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, ownerId = _request$body.ownerId, categoryId = _request$body.categoryId, subcategoryId = _request$body.subcategoryId, brandId = _request$body.brandId;
          customerPromise = CustomerModel.findById(ownerId);
          categoryPromise = SpecialityModel.findById(categoryId);
          subcategoryPromise = SpecialityModel.findById(subcategoryId);
          brandPromise = BrandModel.findById(brandId);
          _context6.next = 11;
          return regeneratorRuntime.awrap(Promise.all([customerPromise, categoryPromise, subcategoryPromise, brandPromise]));

        case 11:
          _ref = _context6.sent;
          _ref2 = _slicedToArray(_ref, 4);
          customer = _ref2[0];
          category = _ref2[1];
          subcategory = _ref2[2];
          brand = _ref2[3];

          if (customer) {
            _context6.next = 19;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Customer ID does not exist',
            field: 'ownerId'
          }));

        case 19:
          if (category) {
            _context6.next = 21;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Category ID does not exist',
            field: 'categoryId'
          }));

        case 21:
          if (subcategory) {
            _context6.next = 23;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Subcategory ID does not exist',
            field: 'subcategoryId'
          }));

        case 23:
          if (brand) {
            _context6.next = 25;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Brand ID does not exist',
            field: 'brandId'
          }));

        case 25:
          _context6.next = 27;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'item'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 27:
          counter = _context6.sent;
          itemData = _objectSpread({
            itemId: counter.value
          }, request.body);
          itemObj = new ItemModel(itemData);
          _context6.next = 32;
          return regeneratorRuntime.awrap(itemObj.save());

        case 32:
          newItem = _context6.sent;
          _context6.next = 35;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(categoryId, {
            $inc: {
              total: 1
            }
          }, {
            "new": true
          }));

        case 35:
          updatedCategory = _context6.sent;
          _context6.next = 38;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(subcategoryId, {
            $inc: {
              total: 1
            }
          }, {
            "new": true
          }));

        case 38:
          updatedSubcategory = _context6.sent;
          _context6.next = 41;
          return regeneratorRuntime.awrap(BrandModel.findByIdAndUpdate(brandId, {
            $inc: {
              total: 1
            }
          }, {
            "new": true
          }));

        case 41:
          updatedBrand = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added new item successfully!',
            item: newItem,
            category: updatedCategory,
            subcategory: updatedSubcategory,
            brand: updatedBrand
          }));

        case 45:
          _context6.prev = 45;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 49:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 45]]);
};

var updateItem = function updateItem(request, response) {
  var dataValidation, itemId, _request$body2, categoryId, subcategoryId, brandId, categoryPromise, subcategoryPromise, brandPromise, _ref3, _ref4, category, subcategory, brand, updatedItem;

  return regeneratorRuntime.async(function updateItem$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dataValidation = itemValidation.updateItem(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          itemId = request.params.itemId;
          _request$body2 = request.body, categoryId = _request$body2.categoryId, subcategoryId = _request$body2.subcategoryId, brandId = _request$body2.brandId;
          categoryPromise = SpecialityModel.findById(categoryId);
          subcategoryPromise = SpecialityModel.findById(subcategoryId);
          brandPromise = BrandModel.findById(brandId);
          _context7.next = 11;
          return regeneratorRuntime.awrap(Promise.all([categoryPromise, subcategoryPromise, brandPromise]));

        case 11:
          _ref3 = _context7.sent;
          _ref4 = _slicedToArray(_ref3, 3);
          category = _ref4[0];
          subcategory = _ref4[1];
          brand = _ref4[2];

          if (category) {
            _context7.next = 18;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Category ID does not exist',
            field: 'categoryId'
          }));

        case 18:
          if (subcategory) {
            _context7.next = 20;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Subcategory ID does not exist',
            field: 'subcategoryId'
          }));

        case 20:
          if (brand) {
            _context7.next = 22;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Brand ID does not exist',
            field: 'brandId'
          }));

        case 22:
          _context7.next = 24;
          return regeneratorRuntime.awrap(ItemModel.findByIdAndUpdate(itemId, request.body, {
            "new": true
          }));

        case 24:
          updatedItem = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated item successfully!',
            item: updatedItem
          }));

        case 28:
          _context7.prev = 28;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 32:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var deleteItem = function deleteItem(request, response) {
  var itemId, deletedItem, updatedCategory, updatedSubcategory, updatedBrand;
  return regeneratorRuntime.async(function deleteItem$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          itemId = request.params.itemId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(ItemModel.findByIdAndDelete(itemId));

        case 4:
          deletedItem = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(deletedItem.categoryId, {
            $inc: {
              total: -1
            }
          }, {
            "new": true
          }));

        case 7:
          updatedCategory = _context8.sent;
          _context8.next = 10;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(deletedItem.subcategoryId, {
            $inc: {
              total: -1
            }
          }, {
            "new": true
          }));

        case 10:
          updatedSubcategory = _context8.sent;
          _context8.next = 13;
          return regeneratorRuntime.awrap(BrandModel.findByIdAndUpdate(deletedItem.brandId, {
            $inc: {
              total: -1
            }
          }, {
            "new": true
          }));

        case 13:
          updatedBrand = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted item successfully!',
            item: deletedItem,
            category: updatedCategory,
            subcategory: updatedSubcategory,
            brand: updatedBrand
          }));

        case 17:
          _context8.prev = 17;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var updateItemMainImage = function updateItemMainImage(request, response) {
  var dataValidation, itemId, mainImage, updatedItem;
  return regeneratorRuntime.async(function updateItemMainImage$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          dataValidation = itemValidation.updateItemMainImage(request.body);

          if (dataValidation.isAccepted) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          itemId = request.params.itemId;
          mainImage = request.body.mainImage;
          _context9.next = 8;
          return regeneratorRuntime.awrap(ItemModel.findByIdAndUpdate(itemId, {
            mainImage: mainImage
          }, {
            "new": true
          }));

        case 8:
          updatedItem = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated item main image successfully!',
            item: updatedItem
          }));

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var addItemImages = function addItemImages(request, response) {
  var dataValidation, itemId, images, updatedItem;
  return regeneratorRuntime.async(function addItemImages$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          dataValidation = itemValidation.addItemImages(request.body);

          if (dataValidation.isAccepted) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          itemId = request.params.itemId;
          images = request.body.images;
          _context10.next = 8;
          return regeneratorRuntime.awrap(ItemModel.findByIdAndUpdate(itemId, {
            $push: {
              images: {
                $each: images
              }
            }
          }, {
            "new": true
          }));

        case 8:
          updatedItem = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added item images successfully!',
            item: updatedItem
          }));

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var removeItemImage = function removeItemImage(request, response) {
  var dataValidation, itemId, imageURL, updatedItem;
  return regeneratorRuntime.async(function removeItemImage$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          dataValidation = itemValidation.removeItemImage(request.body);

          if (dataValidation.isAccepted) {
            _context11.next = 4;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          itemId = request.params.itemId;
          imageURL = request.body.imageURL;
          _context11.next = 8;
          return regeneratorRuntime.awrap(ItemModel.findByIdAndUpdate(itemId, {
            $pull: {
              images: imageURL
            }
          }, {
            "new": true
          }));

        case 8:
          updatedItem = _context11.sent;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Removed item image successfully!',
            item: updatedItem
          }));

        case 12:
          _context11.prev = 12;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getItemsGrowthStats = function getItemsGrowthStats(request, response) {
  var groupBy, format, itemsGrowth;
  return regeneratorRuntime.async(function getItemsGrowthStats$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          groupBy = request.query.groupBy;
          format = '%Y-%m-%d';

          if (groupBy == 'MONTH') {
            format = '%Y-%m';
          } else if (groupBy == 'YEAR') {
            format = '%Y';
          }

          _context12.next = 6;
          return regeneratorRuntime.awrap(ItemModel.aggregate([{
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
          itemsGrowth = _context12.sent;
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            itemsGrowth: itemsGrowth
          }));

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 14:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  getItems: getItems,
  getItemsByOwnerId: getItemsByOwnerId,
  getItem: getItem,
  getItemByNumericId: getItemByNumericId,
  addItem: addItem,
  deleteItem: deleteItem,
  updateItem: updateItem,
  searchItemsByCategory: searchItemsByCategory,
  updateItemMainImage: updateItemMainImage,
  addItemImages: addItemImages,
  removeItemImage: removeItemImage,
  getItemsGrowthStats: getItemsGrowthStats
};