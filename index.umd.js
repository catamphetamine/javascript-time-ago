'use strict'

var javascript_time_ago = require('./build/time ago')['default']

// Doesn't work with Rollup, so commented that out
// https://github.com/halt-hammerzeit/javascript-time-ago/issues/1
// Languages will have to be loaded manually.
//
// // Add all locale data to `javascript-time-ago`.
// // This module will be ignored when bundling 
// // for the browser with Browserify/Webpack.
// global.javascript_time_ago = javascript_time_ago
// require('./locales')
// delete global.javascript_time_ago

exports = module.exports = javascript_time_ago
exports['default'] = exports

var classify_elapsed = require('./build/classify elapsed')

exports.a_day           = classify_elapsed.a_day
exports.days_in_a_month = classify_elapsed.days_in_a_month
exports.days_in_a_year  = classify_elapsed.days_in_a_year
exports.gradation       = classify_elapsed.gradation