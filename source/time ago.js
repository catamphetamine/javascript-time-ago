// a part of this code is adopted from
// https://github.com/yahoo/intl-relativeformat/

import IntlMessageFormat from 'intl-messageformat'
import classify_elapsed from './classify elapsed'

export default class React_time_ago
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
		this.locale = this.resolve_locale(locales)
		// Get relative time formatter messages for this locale
		this.fields = React_time_ago.locale_data[this.locale]
		// Available time measurement units
		this.units = Object.keys(this.fields)

		// Is passed later on to `IntlMessageFormat`
		this.locales = locales
	}

	// formats the relative date
	format(input, options = {})
	{
		let time
		
		if (typeof input === 'number')
		{
			time = input
		}
		else if (input.constructor === Date)
		{
			time = input.getTime()
		}
		else
		{
			throw new Error(`Unsupported fuzzy time input: ${input}`)
		}

		// can pass a custom `now` for testing purpose
		const now = options.now || Date.now()

		const elapsed = (now - time) / 1000 // in seconds

		// Available time interval measurement units
		let units = this.units
		if (options.units)
		{
			units = options.units.filter(unit => Object.keys(this.fields).indexOf(unit) >= 0)
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

		const formatters = this.get_formatters(unit)

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
			when : elapsed <= 0 ? 'past' : 'future'
		})
	}

	// lazy creation of a formatter for a given time measurement unit
	// (second, minute, hour, day, etc)
	get_formatters(unit)
	{
		// Create a new synthetic message based on the locale data from CLDR.
		if (!this.formatters[unit])
		{
			this.formatters[unit] = this.compile_formatters(unit)
		}

		return this.formatters[unit]
	}

	// compiles formatter for the specified time measurement unit 
	// (second, minute, hour, day, etc)
	compile_formatters(unit)
	{
		// Locale specific time interval formatter messages
		// for the given time interval measurement unit
		const formatter_messages = this.fields[unit]

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

	// Chooses the most appropriate locale 
	// based on the list of preferred locales supplied by the user
	resolve_locale(locales)
	{
		// Suppose it's an array
		if (typeof locales === 'string')
		{
			locales = [locales]
		}

		// Create a copy of the array so we can push on the default locale.
		locales = (locales || []).concat(React_time_ago.default_locale)

		// Using the set of locales + the default locale, we look for the first one
		// which that has been registered. When data does not exist for a locale, we
		// traverse its ancestors to find something that's been registered within
		// its hierarchy of locales. Since we lack the proper `parentLocale` data
		// here, we must take a naive approach to traversal.
		for (let locale of locales)
		{
			const locale_parts = locale.toLowerCase().split('-')

			while (locale_parts.length)
			{
				const locale_try = locale_parts.join('-')

				if (React_time_ago.locale_data[locale_try])
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
}

// Adds locale data
React_time_ago.locale = function(locale, locale_data)
{
	// Convert from CLDR format (if needed)
	locale_data = from_CLDR(locale_data)

	// Store locale specific messages in the static variable
	React_time_ago.locale_data[locale.toLowerCase()] = locale_data

	// (will be added manually by this library user)
	// // Add locale data to IntlMessageFormat
	// // (to be more specific: the `pluralRuleFunction`)
	// require('intl-messageformat/locale-data/ru')
}

// Converts locale data from CLDR format (if needed)
export function from_CLDR(data)
{
	const converted = {}

	for (let key of Object.keys(data))
	{
		const entry = data[key]

		const converted_entry = {}
		
		if (entry.previous)
		{
			converted_entry.previous = entry.previous
		}
		
		if (entry.current)
		{
			converted_entry.current = entry.current
		}
		
		if (entry.next)
		{
			converted_entry.next = entry.next
		}
		
		if (entry.past)
		{
			converted_entry.past = entry.past
		}
		
		if (entry.future)
		{
			converted_entry.future = entry.future
		}

		converted[key] = converted_entry

		if (entry['relative-type--1'])
		{
			converted_entry.previous = entry['relative-type--1']
		}

		if (entry['relative-type-0'])
		{
			converted_entry.current = entry['relative-type-0']
		}

		if (entry['relative-type-1'])
		{
			converted_entry.next = entry['relative-type-1']
		}

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