var long          = require('./long.json')
var long_concise  = require('./long-concise.json')
var short         = require('./short.json')
var short_concise = require('./short-concise.json')
var tiny          = require('./tiny.json')

var plural        = require('./plural').default

module.exports =
{
	locale : 'ru',

	short           : short,
	'short-concise' : short_concise,
	long            : long,
	'long-concise'  : long_concise,
	tiny            : tiny,

	plural : plural
}