import are_intl_locales_supported from 'intl-locales-supported'

if (global.Intl)
{
	// Determine if the built-in `Intl` has the locale data we need
	if (!are_intl_locales_supported(['en', 'ru']))
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

import chai from 'chai'
chai.should()

require('./time ago')