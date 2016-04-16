export { default } from './source/time ago'
export { a_day, days_in_a_month, days_in_a_year, gradation } from './source/classify elapsed'

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