// This file is in ES5 syntax to allow for older versions of Node.js

var path = require('path')
var fs = require('fs')
var javascript_time_ago = require('javascript-time-ago')

fs.readdirSync(path.resolve(__dirname, 'locales')).forEach(function(file)
{
	var locale = file.replace(/\.js$/, '')
	javascript_time_ago.locale(require(path.resolve(__dirname, 'locales', locale)))
})