import javascript_time_ago from './source/time ago'

// Add all locale data to `javascript-time-ago`.
// This module will be ignored when bundling 
// for the browser with Browserify/Webpack.
global.javascript_time_ago = javascript_time_ago
require('./locales')
delete global.javascript_time_ago

// export {  default, from_CLDR } from './source/time ago'
export default javascript_time_ago
export { a_day, days_in_a_month, days_in_a_year, gradation } from './source/classify elapsed'