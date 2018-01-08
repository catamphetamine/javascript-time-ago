'use strict'

exports = module.exports = require('./build/index').default
exports['default'] = exports

var gradation = require('./build/gradation')

exports.day       = gradation.day
exports.month     = gradation.month
exports.year      = gradation.year
exports.gradation = gradation.default