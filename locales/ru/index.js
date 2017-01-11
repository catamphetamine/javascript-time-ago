var long          = require('./long')
var long_concise  = require('./long concise')
var short         = require('./short')
var short_concise = require('./short concise')
var tiny          = require('./tiny')

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