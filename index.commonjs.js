'use strict'

exports = module.exports = require('./commonjs/JavascriptTimeAgo').default
exports['default'] = exports

var locale = require('./commonjs/locale')

exports.intlDateTimeFormatSupported       = locale.intlDateTimeFormatSupported
exports.intlDateTimeFormatSupportedLocale = locale.intlDateTimeFormatSupportedLocale

exports.RelativeTimeFormat = require('./commonjs/RelativeTimeFormat').default