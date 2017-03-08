var long          = require('./long.json')
var long_concise  = require('./long concise.json')
var short         = require('./short.json')
var short_concise = require('./short concise.json')
var tiny          = require('./tiny.json')

module.exports =
{
	locale        : 'ru',
	// `default` may conflict with ES6
	// default       : long,

	tiny          : tiny,
	short         : short,
	short_concise : short_concise,
	long          : long,
	long_concise  : long_concise
}