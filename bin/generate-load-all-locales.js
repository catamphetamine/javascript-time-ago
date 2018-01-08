// This file is in ES5 syntax to allow for older versions of Node.js

var path = require('path')
var fs = require('fs')
// var javascript_time_ago = require('javascript-time-ago').default
var javascript_time_ago = require('../source').default

var locales = []

fs.readdirSync(path.resolve(__dirname, '../locale')).forEach(function(filename)
{
	var locale_path = path.resolve(__dirname, '../locale', filename)
	if (fs.statSync(locale_path).isDirectory())
	{
		locales.push(filename)
	}
})

fs.writeFileSync(path.resolve(__dirname, '../load-all-locales.js'),
`
var TimeAgo = require("javascript-time-ago")

${locales.map(locale => 'var ' + locale + ' = require("javascript-time-ago/locale/' + locale + '")').join('\n')}

${locales.map(locale => 'TimeAgo.locale(' + locale + ')').join('\n')}
`
.trim())