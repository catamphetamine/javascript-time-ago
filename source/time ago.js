// a part of this code is adopted from
// https://github.com/yahoo/intl-relativeformat/

import IntlMessageFormat from 'intl-messageformat'
import classify_elapsed  from './classify elapsed'
import style             from './style'

export default class Javascript_time_ago
{
	// Fallback locale
	// (when not a single supplied preferred locale is available)
	static default_locale = 'en'

	// For all configured locales
	// their relative time formatter messages will be stored here
	static locale_data = {}

	// Relative time interval message formatters cache
	formatters = {}

	constructor(locales, options)
	{
		// Make a copy of `locales` if it's an array, so that it doesn't change
		// since it's used lazily.
		if (Array.isArray(locales))
		{
			locales = locales.concat()
		}

		// Choose the most appropriate locale
		this.locale = resolve_locale(locales)

		// Is passed later on to `IntlMessageFormat`
		this.locales = locales

		// Presets
		this.style = style(locales)
	}

	// Formats the relative date.
	//
	// Returns: a string
	//
	// Parameters:
	//
	//    options - (optional)
	//
	//       units     - a list of allowed time units
	//                   (e.g. ['second', 'minute', 'hour', …])
	//
	//       gradation - time scale gradation steps.
	//                   (e.g.
	//                   [
	//                      { unit: 'second', factor: 1 }, 
	//                      { unit: 'minute', factor: 60, threshold: 60 },
	//                      …
	//                   ])
	//
	//       override - function ({ elapsed, time, date, now })
	//
	//                  If the `override` function returns a value,
	//                  then the `.format()` call will return that value.
	//                  Otherwise it has no effect.
	//
	format(input, options = {})
	{
		// Get locale messages for this formatting flavour
		const { flavour, locale_data } = this.locale_data(options.flavour)

		let date
		let time
		
		if (input.constructor === Date)
		{
			date = input
			time = input.getTime()
		}
		else if (typeof input === 'number')
		{
			time = input
			date = new Date(input)
		}
		else
		{
			throw new Error(`Unsupported relative time formatter input: ${typeof input}, ${input}`)
		}

		// can pass a custom `now` for testing purpose
		const now = options.now || Date.now()

		// how much time elapsed (in seconds)
		const elapsed = (now - time) / 1000 // in seconds

		// Allows output customization.
		// For example, seconds, minutes and hours can be shown relatively,
		// and other intervals can be shown using full date format.
		// (see Twitter style)
		if (options.override)
		{
			const override = options.override({ elapsed, time, date, now })
			if (override !== undefined)
			{
				return override
			}
		}

		// Available time interval measurement units
		let units = Object.keys(locale_data)

		if (options.units)
		{
			// Find available time interval measurement units
			units = options.units.filter(unit => units.indexOf(unit) >= 0)
		}

		// Choose the appropriate time measurement unit 
		// and get the corresponding rounded time amount
		const { unit, amount } = classify_elapsed(Math.abs(elapsed), units, options.gradation)

		// If no time unit is suitable, just output empty string
		if (!unit)
		{
			return ''
		}

		// format the message for the chosen time measurement unit
		// (second, minute, hour, day, etc)

		const formatters = this.get_formatters(unit, flavour)

		// default formatter: "X units"
		let formatter = formatters.default

		// in case of "0 units"
		if (amount === 0 && formatters.current)
		{
			formatter = formatters.current
		}

		// in case of "previous unit" or "next unit"
		if ((amount === -1 || amount === 1) && formatters.previous_next)
		{
			formatter = formatters.previous_next
		}

		// return formatted time amount
		return formatter.format
		({
			'0'  : amount,
			when : elapsed >= 0 ? 'past' : 'future'
		})
	}

	// Gets locale messages for this formatting flavour
	locale_data(flavour)
	{
		// Get relative time formatter messages for this locale
		const locale_data = Javascript_time_ago.locale_data[this.locale]

		// Fallback to "default" flavour if the given flavour isn't available
		if (!flavour || !locale_data[flavour])
		{
			flavour = 'default'
		}

		return { flavour, locale_data: locale_data[flavour] }
	}

	// lazy creation of a formatter for a given time measurement unit
	// (second, minute, hour, day, etc)
	get_formatters(unit, flavour)
	{
		if (!this.formatters[flavour])
		{
			this.formatters[flavour] = {}
		}

		const formatters = this.formatters[flavour]

		// Create a new synthetic message based on the locale data from CLDR.
		if (!formatters[unit])
		{
			formatters[unit] = this.compile_formatters(unit, flavour)
		}

		return formatters[unit]
	}

	// compiles formatter for the specified time measurement unit 
	// (second, minute, hour, day, etc)
	compile_formatters(unit, flavour)
	{
		// Locale specific time interval formatter messages
		// for the given time interval measurement unit
		const formatter_messages = Javascript_time_ago.locale_data[this.locale][flavour][unit]

		// Locale specific time interval formatter messages
		// for the given time interval measurement unit
		// for "past" and "future"
		//
		// (e.g.
		//  {
		//   "relativeTimePattern-count-one": "{0} second ago",
		//   "relativeTimePattern-count-other": "{0} seconds ago"
		//  })
		//
		const past_formatter_messages   = formatter_messages.past
		const future_formatter_messages = formatter_messages.future

		// `format.js` number formatter messages
		// e.g. "one {# second ago} other {# seconds ago}"
		let past_formatter   = ''
		let future_formatter = ''

		// Compose "past" formatter specification
		// (replacing CLDR number placeholder "{0}" 
		//  with format.js number placeholder "#")
		for (let key of Object.keys(past_formatter_messages))
		{
			past_formatter += ` ${key} 
					{${past_formatter_messages[key].replace('{0}', '#')}}`
		}

		// Compose "future" formatter specification
		// (replacing CLDR number placeholder "{0}" 
		//  with format.js number placeholder "#")
		for (let key of Object.keys(future_formatter_messages))
		{
			// e.g. += " one {# sec. ago}"
			future_formatter += ` ${key} 
					{${future_formatter_messages[key].replace('{0}', '#')}}`
		}

		// The ultimate time interval `format.js` specification
		// ("0" will be replaced with the first argument
		//  when the message will be formatted)
		const message = `{ when, select, past   {{0, plural, ${past_formatter}}}
		                                 future {{0, plural, ${future_formatter}}} }`

		// Create the synthetic IntlMessageFormat instance 
		// using the original locales specified by the user
		const default_formatter = new IntlMessageFormat(message, this.locales)

		const formatters = 
		{
			default: default_formatter
		}

		// "0 units" formatter
		if (formatter_messages.current)
		{
			formatters.current =
			{
				format: () => formatter_messages.current
			}
		}

		// "previous unit" and "next unit" formatter
		if (formatter_messages.previous && formatter_messages.next)
		{
			const previous_next_message = `{ when, select, past   {${formatter_messages.previous}}
			                                               future {${formatter_messages.next}} }`
		
			// Create the synthetic IntlMessageFormat instance 
			// using the original locales specified by the user
			formatters.previous_next = new IntlMessageFormat(previous_next_message, this.locales)
		}

		return formatters
	}
}

// Chooses the most appropriate locale 
// based on the list of preferred locales supplied by the user
export function resolve_locale(locales)
{
	// Suppose it's an array
	if (typeof locales === 'string')
	{
		locales = [locales]
	}

	// Create a copy of the array so we can push on the default locale.
	locales = (locales || []).concat(Javascript_time_ago.default_locale)

	// Using the set of locales + the default locale, we look for the first one
	// which that has been registered. When data does not exist for a locale, we
	// traverse its ancestors to find something that's been registered within
	// its hierarchy of locales. Since we lack the proper `parentLocale` data
	// here, we must take a naive approach to traversal.
	for (let locale of locales)
	{
		const locale_parts = locale.split('-')

		while (locale_parts.length)
		{
			const locale_try = locale_parts.join('-')

			if (Javascript_time_ago.locale_data[locale_try])
			{
				// Return the normalized locale string; 
				// e.g., we return "en-US",
				// instead of "en-us".
				return locale_try
			}

			locale_parts.pop()
		}
	}

	throw new Error(`No locale data has been added for any of the locales: ${locales.join(', ')}`)
}

// Adds locale data
Javascript_time_ago.locale = function(locale_data)
{
	let locale
	let locale_data_map

	if (!locale_data)
	{
		throw new Error(`The passed in locale data is undefined`)
	}

	if (locale_data.main)
	{
		locale = Object.keys(locale_data.main)[0]

		// Convert from CLDR format
		locale_data_map = from_CLDR(locale_data)
	}
	else
	{
		locale = locale_data.locale

		locale_data_map = {}

		// Supports multiple locale variations
		// (e.g. "default", "short", "normal", "long", etc)
		for (let key of Object.keys(locale_data))
		{
			if (key !== 'locale')
			{
				locale_data_map[key] = locale_data[key]
			}
		}
	}

	// Guard against malformed input
	if (!locale)
	{
		throw new Error(`Couldn't determine locale for this locale data. Make sure the "locale" property is present.`)
	}

	// Ensure default formatting flavour is set
	if (!locale_data_map.default)
	{
		locale_data_map.default = locale_data_map.long || locale_data_map[Object.keys(locale_data_map)[0]]
	}

	// Store locale specific messages in the static variable
	Javascript_time_ago.locale_data[locale] = locale_data_map

	// (will be added manually by this library user)
	// // Add locale data to IntlMessageFormat
	// // (to be more specific: the `pluralRuleFunction`)
	// require('intl-messageformat/locale-data/ru')
}

// Converts locale data from CLDR format (if needed)
export function from_CLDR(data)
{
	// the usual time measurement units
	const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']

	// result
	const converted = { long: {} }

	// detects the short flavour of labels (yr., mo., etc)
	const short = /-short$/

	const locale = Object.keys(data.main)[0]
	data = data.main[locale].dates.fields

	for (let key of Object.keys(data))
	{
		// take only the usual time measurement units
		if (units.indexOf(key) < 0 && units.indexOf(key.replace(short, '')) < 0)
		{
			continue
		}

		const entry = data[key]
		const converted_entry = {}

		// if a key ends with `-short`, then it's a "short" flavour
		if (short.test(key))
		{
			if (!converted.short)
			{
				converted.short = {}
			}

			converted.short[key.replace(short, '')] = converted_entry
		}
		else
		{
			converted.long[key] = converted_entry
		}

		// the "relative" values aren't suitable for "ago" or "in a" cases,
		// because "1 year ago" != "last year"

		// if (entry['relative-type--1'])
		// {
		// 	converted_entry.previous = entry['relative-type--1']
		// }

		// if (entry['relative-type-0'])
		// {
		// 	converted_entry.current = entry['relative-type-0']
		// }

		// if (entry['relative-type-1'])
		// {
		// 	converted_entry.next = entry['relative-type-1']
		// }

		if (entry['relativeTime-type-past'])
		{
			const past = entry['relativeTime-type-past']
			converted_entry.past = {}

			for (let subkey of Object.keys(past))
			{
				const prefix = 'relativeTimePattern-count-'
				const converted_subkey = subkey.replace(prefix, '')

				converted_entry.past[converted_subkey] = past[subkey]
			}
		}

		if (entry['relativeTime-type-future'])
		{
			const future = entry['relativeTime-type-future']
			converted_entry.future = {}

			for (let subkey of Object.keys(future))
			{
				const prefix = 'relativeTimePattern-count-'
				const converted_subkey = subkey.replace(prefix, '')

				converted_entry.future[converted_subkey] = future[subkey]
			}
		}
	}

	return converted
}