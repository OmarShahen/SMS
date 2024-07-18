"use strict";

var mongoose = require('mongoose');

var BrandSchema = new mongoose.Schema({
  brandId: {
    type: Number,
    required: true,
    unique: true
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Brand', BrandSchema);