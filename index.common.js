'use strict'

exports = module.exports = require('./build/time ago').default
exports['default'] = exports

var gradation = require('./build/gradation')

exports.a_day           = gradation.a_day
exports.days_in_a_month = gradation.days_in_a_month
exports.days_in_a_year  = gradation.days_in_a_year
exports.gradation       = gradation.default