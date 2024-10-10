const config = require('../config/config')

const types = config.EXAM_TYPES
const subtypes = config.EXAM_SUBTYPES

const isValidTypes = (inputs) => {
    return inputs.every(input => types.includes(input.toUpperCase()))
}


const isValidSubtypes = (inputs) => {
    return inputs.every(input => subtypes.includes(input.toUpperCase()))
}


module.exports = { isValidTypes, isValidSubtypes }