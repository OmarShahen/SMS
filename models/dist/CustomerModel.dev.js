"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var CustomerSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Customer', CustomerSchema);