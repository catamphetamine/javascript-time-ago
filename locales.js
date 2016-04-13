var fs = require('fs')

fs.readdirSync('./locales').forEach(function(file)
{
	var locale = file.replace(/\.js$/, '')
	javascript_time_ago.locale(locale, require('./locales/' + locale))
})