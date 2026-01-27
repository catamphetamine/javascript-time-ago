'use strict'

exports = module.exports = require('./commonjs/TimeAgo.js').default
exports['default'] = require('./commonjs/TimeAgo.js').default

// These two legacy exports are deprecated.
var locale = require('./commonjs/locale.js')
exports.intlDateTimeFormatSupported = locale.intlDateTimeFormatSupported
exports.intlDateTimeFormatSupportedLocale = locale.intlDateTimeFormatSupportedLocale