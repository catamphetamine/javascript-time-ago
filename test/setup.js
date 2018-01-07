import are_intl_locales_supported from 'intl-locales-supported'
import Intl_polyfill from 'intl'
import chai from 'chai'

import javascript_time_ago from '../source/time ago'

// (`intl-messageformat` will load everything automatically when run in Node.js)
import * as en from '../locales/en/index.es6'
import * as ru from '../locales/ru/index.es6'

const locales = ['en', 'ru']

if (global.Intl)
{
	// Determine if the built-in `Intl` has the locale data we need
	if (!are_intl_locales_supported(locales))
	{
		// `Intl` exists, but it doesn't have the data we need, so load the
		// polyfill and patch the constructors we need with the polyfill's
		Intl.NumberFormat   = Intl_polyfill.NumberFormat
		Intl.DateTimeFormat = Intl_polyfill.DateTimeFormat
	}
}
else
{
	// No `Intl`, so use and load the polyfill
	global.Intl = Intl_polyfill
}

// Load localization data for Node.js
// (`intl-messageformat` will load everything automatically when run in Node.js)
javascript_time_ago.locale(en)
javascript_time_ago.locale(ru)

chai.should()