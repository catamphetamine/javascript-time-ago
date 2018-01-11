'use strict'

exports = module.exports = require('./commonjs/JavascriptTimeAgo').default
exports['default'] = exports

var locale = require('./commonjs/locale')

exports.intlSupportedLocale = locale.intlSupportedLocale

exports.RelativeTimeFormat = require('./commonjs/RelativeTimeFormat').default