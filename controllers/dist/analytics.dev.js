"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UserModel = require('../models/UserModel');

var AppointmentModel = require('../models/AppointmentModel');

var ExpertVerificationModel = require('../models/ExpertVerificationModel');

var ReviewModel = require('../models/ReviewModel');

var CustomerModel = require('../models/CustomerModel');

var ItemModel = require('../models/ItemModel');

var SpecialityModel = require('../models/SpecialityModel');

var utils = require('../utils/utils');
/*const getOverviewAnalytics = async (request, response) => {

    try {


        /*const clinicPatientsGrowth = await ClinicPatientModel.aggregate([
            {
                $match: {
                    clinicId: { $in: uniqueOwnedIdsList }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysOverallExperienceScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$overallExperience',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysImprovementScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$improvement',
                    count: { $sum: 1 }
                }
            }
        ])

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const totalSeekers = await UserModel
        .countDocuments({ ...searchQuery, isVerified: true, type: 'SEEKER' })

        const totalExperts = await UserModel
        .countDocuments({ ...searchQuery, isVerified: true, type: 'EXPERT' })

        const totalAppointments = await AppointmentModel
        .countDocuments({ ...searchQuery, isPaid: true })

        const totalExpertVerifications = await ExpertVerificationModel
        .countDocuments({ ...searchQuery })

        const totalReviews = await ReviewModel
        .countDocuments({ ...searchQuery })

        const reviewsRatingList = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ])

        let reviewsRating = 0

        if(reviewsRatingList.length != 0) {
            reviewsRating = reviewsRatingList[0].averageRating
            reviewsRating = Number.parseFloat(reviewsRating.toFixed(2))
        }

        return response.status(200).json({
            accepted: true,
            totalSeekers,
            totalExperts,
            totalAppointments,
            totalExpertVerifications,
            totalReviews,
            reviewsRating
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}*/


var getUsersGrowthStats = function getUsersGrowthStats(request, response) {
  var _request$query, groupBy, type, format, matchQuery, usersGrowth;

  return regeneratorRuntime.async(function getUsersGrowthStats$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _request$query = request.query, groupBy = _request$query.groupBy, type = _request$query.type;
          format = '%Y-%m-%d';

          if (groupBy == 'MONTH') {
            format = '%Y-%m';
          } else if (groupBy == 'YEAR') {
            format = '%Y';
          }

          matchQuery = {
            isVerified: true
          };

          if (type == 'SEEKER') {
            matchQuery.type = 'SEEKER';
          } else if (type == 'EXPERT') {
            matchQuery.type = 'EXPERT';
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
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

        case 8:
          usersGrowth = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            usersGrowth: usersGrowth
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

var getOverviewAnalytics = function getOverviewAnalytics(request, response) {
  var _utils$statsQueryGene, searchQuery, totalCustomers, totalItems, totalSellingItems, totalRentingItems;

  return regeneratorRuntime.async(function getOverviewAnalytics$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context2.next = 4;
          return regeneratorRuntime.awrap(CustomerModel.countDocuments(_objectSpread({}, searchQuery)));

        case 4:
          totalCustomers = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(ItemModel.countDocuments(_objectSpread({}, searchQuery)));

        case 7:
          totalItems = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(ItemModel.countDocuments(_objectSpread({}, searchQuery, {
            isForSelling: true
          })));

        case 10:
          totalSellingItems = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(ItemModel.countDocuments(_objectSpread({}, searchQuery, {
            isForRenting: true
          })));

        case 13:
          totalRentingItems = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            totalCustomers: totalCustomers,
            totalItems: totalItems,
            totalSellingItems: totalSellingItems,
            totalRentingItems: totalRentingItems
          }));

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

module.exports = {
  getOverviewAnalytics: getOverviewAnalytics,
  getUsersGrowthStats: getUsersGrowthStats
};