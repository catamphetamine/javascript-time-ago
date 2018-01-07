import parse_CLDR from './cldr'

// Parses input locale data into a suitable format.
//
// @param {Object} locale_data_input - Locale data (input).
// @returns {Object} Returns parsed locale data.
//
// Locale data being input can either be
// in CLDR format or in this library's format.
//
// This library's format (`./locales/en/index.js`):
//
// ```js
// export { default as long }  from './long.json'
// export { default as short } from './short.json'
// export { default as tiny }  from './tiny.json'
//
// export var locale = 'en'
// ```
// 
// Where `long.json` looks like:
//
// ```json
// ...
// "second": {
//   "current": "now",
//   "future": {
//     "one": "in {0} second",
//     "other": "in {0} seconds"
//   },
//   "past": {
//     "one": "{0} second ago",
//     "other": "{0} seconds ago"
//   }
// },
// ...
// ```
export default function parse_locale_data(locale_data_input)
{
	let locale
	let locale_data

	if (!locale_data_input)
	{
		throw new Error('The passed in locale data is undefined')
	}

	// If it's a CLDR locale data then parse it.
	if (locale_data_input.main)
	{
		// Convert from CLDR format
		locale_data = parse_CLDR(locale_data_input)
		locale = Object.keys(locale_data_input.main)[0]
	}
	else
	{
		locale_data = { ...locale_data_input }
		locale = locale_data.locale
		delete locale_data.locale
	}

	// Guard against malformed input
	if (!locale)
	{
		throw new Error(`Couldn't determine locale for this locale data. Make sure the "locale" property is present.`)
	}

	// Ensure "default" formatting flavour is set.
	// By default it's "long" or any other one available.
	if (!locale_data.default)
	{
		locale_data.default = locale_data.long || locale_data[Object.keys(locale_data)[0]]
	}

	return { locale, locale_data }
}