import IntlPolyfill from 'intl'
import intlLocalesSupported from 'intl-locales-supported'

import chai from 'chai'

import javascript_time_ago from '../source/index'

import * as en from '../locale/en'
import * as ru from '../locale/ru'
import * as fr from '../locale/fr'

// Just so this function code is covered.
javascript_time_ago.setDefaultLocale('en')

const locales = ['en', 'ru', 'fr']

if (typeof Intl === 'object')
{
	if (!intlLocalesSupported(locales))
	{
		// `Intl` exists, but it doesn't have the data we need, so load the
		// polyfill and patch the constructors we need with the polyfill's
		Intl.NumberFormat   = IntlPolyfill.NumberFormat
		Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
	}

	// `Intl` property is read-only
	// global.Intl = IntlPolyfill
}
else
{
	// No `Intl`, so use and load the polyfill
	global.Intl = IntlPolyfill
}

// // Fixes "SyntaxError: Invalid regular expression: ...".
// // https://github.com/andyearnshaw/Intl.js/issues/256#issuecomment-349335699
// if (Intl.__disableRegExpRestore)
// {
// 	Intl.__disableRegExpRestore()
// }

// Load localization data for Node.js
javascript_time_ago.locale(en)
javascript_time_ago.locale(ru)
javascript_time_ago.locale(fr)

chai.should()