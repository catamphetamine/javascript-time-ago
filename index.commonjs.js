'use strict'

exports = module.exports = require('./commonjs/JavascriptTimeAgo').default
exports['default'] = require('./commonjs/JavascriptTimeAgo').default

var locale = require('./commonjs/locale')

exports.intlDateTimeFormatSupported       = locale.intlDateTimeFormatSupported
exports.intlDateTimeFormatSupportedLocale = locale.intlDateTimeFormatSupportedLocale