'use strict'

exports = module.exports = require('./commonjs/TimeAgo').default
exports['default'] = require('./commonjs/TimeAgo').default

var locale = require('./commonjs/locale')

exports.intlDateTimeFormatSupported = locale.intlDateTimeFormatSupported
exports.intlDateTimeFormatSupportedLocale = locale.intlDateTimeFormatSupportedLocale