import javascript_time_ago from '../index.es6'
import are_intl_locales_supported from 'intl-locales-supported'

const locales = ['en', 'ru']

if (global.Intl)
{
	// Determine if the built-in `Intl` has the locale data we need
	if (!are_intl_locales_supported(locales))
	{
		// `Intl` exists, but it doesn't have the data we need, so load the
		// polyfill and patch the constructors we need with the polyfill's
		const Intl_polyfill = require('intl')
		Intl.NumberFormat   = Intl_polyfill.NumberFormat
		Intl.DateTimeFormat = Intl_polyfill.DateTimeFormat
	}
}
else
{
	// No `Intl`, so use and load the polyfill
	global.Intl = require('intl')
}

// A faster way to load all the localization data for Node.js
// (`intl-messageformat` will load everything automatically when run in Node.js)
global.javascript_time_ago = javascript_time_ago
require('../load-all-locales')

import chai from 'chai'
chai.should()

require('./time ago')