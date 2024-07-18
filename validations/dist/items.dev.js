"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addItem = function addItem(itemData) {
  var ownerId = itemData.ownerId,
      categoryId = itemData.categoryId,
      subcategoryId = itemData.subcategoryId,
      brandId = itemData.brandId,
      description = itemData.description,
      mainImage = itemData.mainImage,
      images = itemData.images,
      city = itemData.city,
      rentingPrice = itemData.rentingPrice,
      sellingPrice = itemData.sellingPrice,
      isForRenting = itemData.isForRenting,
      isForSelling = itemData.isForSelling,
      manufactureYear = itemData.manufactureYear,
      mileage = itemData.mileage,
      condition = itemData.condition,
      euro = itemData.euro,
      netWeight = itemData.netWeight,
      runningHours = itemData.runningHours,
      enginePower = itemData.enginePower,
      cabin = itemData.cabin,
      suspension = itemData.suspension,
      axles = itemData.axles;
  if (!ownerId) return {
    isAccepted: false,
    message: 'Owner Id is required',
    field: 'ownerId'
  };
  if (!utils.isObjectId(ownerId)) return {
    isAccepted: false,
    message: 'Owner Id format is invalid',
    field: 'ownerId'
  };
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
  if (!subcategoryId) return {
    isAccepted: false,
    message: 'Subcategory Id is required',
    field: 'subcategoryId'
  };
  if (!utils.isObjectId(subcategoryId)) return {
    isAccepted: false,
    message: 'Subcategory Id format is invalid',
    field: 'subcategoryId'
  };
  if (!brandId) return {
    isAccepted: false,
    message: 'Brand Id is required',
    field: 'brandId'
  };
  if (!utils.isObjectId(brandId)) return {
    isAccepted: false,
    message: 'Brand Id format is invalid',
    field: 'brandId'
  };
  if (description && typeof description != 'string') return {
    isAccepted: false,
    message: 'Description format is invalid',
    field: 'description'
  };
  if (mainImage && typeof mainImage != 'string') return {
    isAccepted: false,
    message: 'Main image format is invalid',
    field: 'mainImage'
  };
  if (images && !Array.isArray(images)) return {
    isAccepted: false,
    message: 'Images format is invalid',
    field: 'images'
  };
  if (city && typeof city != 'string') return {
    isAccepted: false,
    message: 'City format is invalid',
    field: 'city'
  };
  if (rentingPrice && typeof rentingPrice != 'number') return {
    isAccepted: false,
    message: 'Renting price format is invalid',
    field: 'rentingPrice'
  };
  if (sellingPrice && typeof sellingPrice != 'number') return {
    isAccepted: false,
    message: 'Selling price format is invalid',
    field: 'sellingPrice'
  };
  if (isForRenting && typeof isForRenting != 'boolean') return {
    isAccepted: false,
    message: 'Is for renting format is invalid',
    field: 'isForRenting'
  };
  if (isForSelling && typeof isForSelling != 'boolean') return {
    isAccepted: false,
    message: 'Is for selling format is invalid',
    field: 'isForSelling'
  };
  if (manufactureYear && !utils.isDateValid(manufactureYear)) return {
    isAccepted: false,
    message: 'Manufacture year format is invalid',
    field: 'manufactureYear'
  };
  if (mileage && typeof mileage != 'number') return {
    isAccepted: false,
    message: 'Mileage format is invalid',
    field: 'mileage'
  };
  if (condition && typeof condition != 'string') return {
    isAccepted: false,
    message: 'Condition format is invalid',
    field: 'condition'
  };
  if (condition && !config.CONDITION.includes(condition)) return {
    isAccepted: false,
    message: 'Condition value is not registered',
    field: 'condition'
  };
  if (euro && typeof euro != 'number') return {
    isAccepted: false,
    message: 'Euro format is invalid',
    field: 'euro'
  };
  if (netWeight && typeof netWeight != 'number') return {
    isAccepted: false,
    message: 'Netweight format is invalid',
    field: 'netWeight'
  };
  if (runningHours && typeof runningHours != 'number') return {
    isAccepted: false,
    message: 'Running hours format is invalid',
    field: 'runningHours'
  };
  if (enginePower && typeof enginePower != 'number') return {
    isAccepted: false,
    message: 'Engine power format is invalid',
    field: 'enginePower'
  };
  if (cabin && typeof cabin != 'string') return {
    isAccepted: false,
    message: 'Cabin format is invalid',
    field: 'cabin'
  };
  if (cabin && !config.CABIN.includes(cabin)) return {
    isAccepted: false,
    message: 'Cabin value is not registered',
    field: 'cabin'
  };
  if (suspension && typeof suspension != 'string') return {
    isAccepted: false,
    message: 'Suspension format is invalid',
    field: 'suspension'
  };
  if (axles && typeof axles != 'number') return {
    isAccepted: false,
    message: 'Axles format is invalid',
    field: 'axles'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: itemData
  };
};

var updateItem = function updateItem(itemData) {
  var categoryId = itemData.categoryId,
      subcategoryId = itemData.subcategoryId,
      brandId = itemData.brandId,
      description = itemData.description,
      mainImage = itemData.mainImage,
      images = itemData.images,
      city = itemData.city,
      rentingPrice = itemData.rentingPrice,
      sellingPrice = itemData.sellingPrice,
      isForRenting = itemData.isForRenting,
      isForSelling = itemData.isForSelling,
      manufactureYear = itemData.manufactureYear,
      mileage = itemData.mileage,
      condition = itemData.condition,
      euro = itemData.euro,
      netWeight = itemData.netWeight,
      runningHours = itemData.runningHours,
      enginePower = itemData.enginePower,
      cabin = itemData.cabin,
      suspension = itemData.suspension,
      axles = itemData.axles;
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
  if (!subcategoryId) return {
    isAccepted: false,
    message: 'Subcategory Id is required',
    field: 'subcategoryId'
  };
  if (!utils.isObjectId(subcategoryId)) return {
    isAccepted: false,
    message: 'Subcategory Id format is invalid',
    field: 'subcategoryId'
  };
  if (!brandId) return {
    isAccepted: false,
    message: 'Brand Id is required',
    field: 'brandId'
  };
  if (!utils.isObjectId(brandId)) return {
    isAccepted: false,
    message: 'Brand Id format is invalid',
    field: 'brandId'
  };
  if (description && typeof description != 'string') return {
    isAccepted: false,
    message: 'Description format is invalid',
    field: 'description'
  };
  if (mainImage && typeof mainImage != 'string') return {
    isAccepted: false,
    message: 'Main image format is invalid',
    field: 'mainImage'
  };
  if (images && !Array.isArray(images)) return {
    isAccepted: false,
    message: 'Images format is invalid',
    field: 'images'
  };
  if (city && typeof city != 'string') return {
    isAccepted: false,
    message: 'City format is invalid',
    field: 'city'
  };
  if (rentingPrice && typeof rentingPrice != 'number') return {
    isAccepted: false,
    message: 'Renting price format is invalid',
    field: 'rentingPrice'
  };
  if (sellingPrice && typeof sellingPrice != 'number') return {
    isAccepted: false,
    message: 'Selling price format is invalid',
    field: 'sellingPrice'
  };
  if (isForRenting && typeof isForRenting != 'boolean') return {
    isAccepted: false,
    message: 'Is for renting format is invalid',
    field: 'isForRenting'
  };
  if (isForSelling && typeof isForSelling != 'boolean') return {
    isAccepted: false,
    message: 'Is for selling format is invalid',
    field: 'isForSelling'
  };
  if (manufactureYear && !utils.isDateValid(manufactureYear)) return {
    isAccepted: false,
    message: 'Manufacture year format is invalid',
    field: 'manufactureYear'
  };
  if (mileage && typeof mileage != 'number') return {
    isAccepted: false,
    message: 'Mileage format is invalid',
    field: 'mileage'
  };
  if (condition && typeof condition != 'string') return {
    isAccepted: false,
    message: 'Condition format is invalid',
    field: 'condition'
  };
  if (condition && !config.CONDITION.includes(condition)) return {
    isAccepted: false,
    message: 'Condition value is not registered',
    field: 'condition'
  };
  if (euro && typeof euro != 'number') return {
    isAccepted: false,
    message: 'Euro format is invalid',
    field: 'euro'
  };
  if (netWeight && typeof netWeight != 'number') return {
    isAccepted: false,
    message: 'Netweight format is invalid',
    field: 'netWeight'
  };
  if (runningHours && typeof runningHours != 'number') return {
    isAccepted: false,
    message: 'Running hours format is invalid',
    field: 'runningHours'
  };
  if (enginePower && typeof enginePower != 'number') return {
    isAccepted: false,
    message: 'Engine power format is invalid',
    field: 'enginePower'
  };
  if (cabin && typeof cabin != 'string') return {
    isAccepted: false,
    message: 'Cabin format is invalid',
    field: 'cabin'
  };
  if (cabin && !config.CABIN.includes(cabin)) return {
    isAccepted: false,
    message: 'Cabin value is not registered',
    field: 'cabin'
  };
  if (suspension && typeof suspension != 'string') return {
    isAccepted: false,
    message: 'Suspension format is invalid',
    field: 'suspension'
  };
  if (axles && typeof axles != 'number') return {
    isAccepted: false,
    message: 'Axles format is invalid',
    field: 'axles'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: itemData
  };
};

var updateItemMainImage = function updateItemMainImage(itemData) {
  var mainImage = itemData.mainImage;
  if (!mainImage) return {
    isAccepted: false,
    message: 'Main image is required',
    field: 'mainImage'
  };
  if (!utils.isValidURL(mainImage)) return {
    isAccepted: false,
    message: 'Main image format is invalid',
    field: 'mainImage'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: itemData
  };
};

var addItemImages = function addItemImages(itemData) {
  var images = itemData.images;
  if (!images) return {
    isAccepted: false,
    message: 'Images is required',
    field: 'images'
  };
  if (!Array.isArray(images)) return {
    isAccepted: false,
    message: 'Images format is invalid',
    field: 'images'
  };

  for (var i = 0; i < images.length; i++) {
    var imageURL = images[i];
    if (typeof imageURL != 'string') return {
      isAccepted: false,
      message: 'Image URL format is invalid',
      field: 'images'
    };
    if (!utils.isValidURL(imageURL)) return {
      isAccepted: false,
      message: 'Image URL format is invalid',
      field: 'images'
    };
  }

  return {
    isAccepted: true,
    message: 'data is valid',
    data: itemData
  };
};

var removeItemImage = function removeItemImage(itemData) {
  var imageURL = itemData.imageURL;
  if (!imageURL) return {
    isAccepted: false,
    message: 'Image URL is required',
    field: 'imageURL'
  };
  if (!utils.isValidURL(imageURL)) return {
    isAccepted: false,
    message: 'Image URL format is invalid',
    field: 'imageURL'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: itemData
  };
};

module.exports = {
  addItem: addItem,
  updateItem: updateItem,
  updateItemMainImage: updateItemMainImage,
  addItemImages: addItemImages,
  removeItemImage: removeItemImage
};