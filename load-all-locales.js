// This file is in ES5 syntax to allow for older versions of Node.js

var path = require('path')
var fs = require('fs')
var javascript_time_ago = require('javascript-time-ago').default

fs.readdirSync(path.resolve(__dirname, 'locale')).forEach(function(filename)
{
	var locale_path = path.resolve(__dirname, 'locale', filename)
	var stats = fs.statSync(locale_path)
	if (stats.isDirectory())
	{
		javascript_time_ago.locale(require(locale_path))
	}
})