import IntlPolyfill from 'intl'
import intlLocalesSupported from 'intl-locales-supported'

import chai, { expect } from 'chai'

import JavascriptTimeAgo from '../source/JavascriptTimeAgo'

import * as en from '../locale/en'
import * as ru from '../locale/ru'
import * as de from '../locale/de'
import * as fr from '../locale/fr'
import * as es from '../locale/es'
import * as it from '../locale/it'
import * as ko from '../locale/ko'
import * as ccp from '../locale/ccp'
import * as zh from '../locale/zh'

const locales = ['en', 'ru', 'de', 'fr', 'es', 'it', 'ko', 'ccp', 'zh']

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
JavascriptTimeAgo.addLocale(en)
JavascriptTimeAgo.addLocale(ru)
JavascriptTimeAgo.addLocale(de)
JavascriptTimeAgo.addLocale(fr)
JavascriptTimeAgo.addLocale(es)
JavascriptTimeAgo.addLocale(it)
JavascriptTimeAgo.addLocale(ko)
JavascriptTimeAgo.addLocale(ccp)
JavascriptTimeAgo.addLocale(zh)

chai.should()
global.expect = expect