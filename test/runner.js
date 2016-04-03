if (typeof global.Intl === 'undefined')
{
	global.Intl = require('intl')
}

global.react_time_ago = require('../source').default

import chai from 'chai'
chai.should()

require('./time ago')