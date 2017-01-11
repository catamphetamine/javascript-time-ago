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

// Load all the localization data for Node.js
// (`intl-messageformat` will load everything automatically when run in Node.js)
import * as en from '../locales/en/index.es6'
import * as ru from '../locales/ru/index.es6'
javascript_time_ago.locale(en)
javascript_time_ago.locale(ru)

import chai from 'chai'
chai.should()

require('./exports')
require('./time ago')