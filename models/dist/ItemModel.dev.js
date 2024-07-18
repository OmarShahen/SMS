"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var ItemSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: true,
    unique: true
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  subcategoryId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  brandId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  description: {
    type: String
  },
  mainImage: {
    type: String
  },
  images: [],
  country: {
    type: String,
    "default": 'EGYPT'
  },
  city: {
    type: String
  },
  rentingPrice: {
    type: Number
  },
  isRent: {
    type: Boolean,
    "default": true
  },
  manufactureYear: {
    type: Date
  },
  mileage: {
    type: Number
  },
  condition: {
    type: String,
    "enum": config.CONDITION
  },
  euro: {
    type: Number
  },
  netWeight: {
    type: Number
  },
  runningHours: {
    type: Number
  },

  /*diggingDepth: { type: Number },
  diggingRadius: { type: Number },*/
  enginePower: {
    type: Number
  },
  cabin: {
    type: String,
    "enum": config.CABIN
  },
  suspension: {
    type: String,
    "enum": config.SUSPENSION
  },
  axles: {
    type: Number
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Item', ItemSchema);