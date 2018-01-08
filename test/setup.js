import are_intl_locales_supported from 'intl-locales-supported'
import Intl from 'intl'
import chai from 'chai'

import javascript_time_ago from '../source/index'

import * as en from '../locale/en'
import * as ru from '../locale/ru'

const locales = ['en', 'ru']

if (global.Intl)
{
	// // Has a bug: "SyntaxError: Invalid regular expression: ...".
	// // https://github.com/andyearnshaw/Intl.js/issues/256#issuecomment-349335699
	// // Determine if the built-in `Intl` has the locale data we need
	// if (!are_intl_locales_supported(locales))
	// {
	// 	// `Intl` exists, but it doesn't have the data we need, so load the
	// 	// polyfill and patch the constructors we need with the polyfill's
	// 	global.Intl.NumberFormat   = Intl_polyfill.NumberFormat
	// 	global.Intl.DateTimeFormat = Intl_polyfill.DateTimeFormat
	// }

	// Using this workaround for now
	global.Intl = Intl
}
else
{
	// No `Intl`, so use and load the polyfill
	global.Intl = Intl
}

// // Fixes "SyntaxError: Invalid regular expression: ...".
// // https://github.com/andyearnshaw/Intl.js/issues/256#issuecomment-349335699
// if (Intl.__disableRegExpRestore)
// {
// 	Intl.__disableRegExpRestore()
// }

// Load localization data for Node.js
// javascript_time_ago.locale(en)
// javascript_time_ago.locale(ru)

require('../load-all-locales')

chai.should()