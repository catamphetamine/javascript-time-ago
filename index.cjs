'use strict'

exports = module.exports = require('./commonjs/TimeAgo.js').default
exports['default'] = require('./commonjs/TimeAgo.js').default

var locale = require('./commonjs/locale.js')

exports.intlDateTimeFormatSupported = locale.intlDateTimeFormatSupported
exports.intlDateTimeFormatSupportedLocale = locale.intlDateTimeFormatSupportedLocale