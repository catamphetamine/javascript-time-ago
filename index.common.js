'use strict'

exports = module.exports = require('./build/time ago').default
exports['default'] = exports

var classify_elapsed = require('./build/classify elapsed')

exports.a_day           = classify_elapsed.a_day
exports.days_in_a_month = classify_elapsed.days_in_a_month
exports.days_in_a_year  = classify_elapsed.days_in_a_year
exports.gradation       = classify_elapsed.gradation