import elapsed           from './elapsed'
import style             from './style'
import choose_locale     from './locale'
import parse_locale_data from './locale data'
import create_formatter  from './formatter'

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

	constructor(locales = [], options)
	{
		if (typeof locales === 'string')
		{
			locales = [locales]
		}

		// The preferred locales are saved
		// to be later passed to `IntlMessageFormat`
		// when creating formatters lazily.
		this.locales = locales.concat(Javascript_time_ago.default_locale)

		// Choose the most appropriate locale
		// (one of the previously added ones)
		// based on the list of preferred `locales` supplied by the user.
		this.locale = choose_locale
		(
			this.locales,
			Object.keys(Javascript_time_ago.locale_data)
		)

		// Relative time formatting presets.
		// A preset is an object having shape
		// `{ units, gradation, flavour, override() }`.
		this.style = style(this.locale)
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
		const { date, time } = get_date_and_time_being_formatted(input)

		// Get locale messages for this formatting flavour
		const { flavour, locale_data } = this.get_locale_data(options.flavour)

		// can pass a custom `now` for testing purpose
		const now = options.now || Date.now()

		// how much time elapsed (in seconds)
		const seconds_elapsed = (now - time) / 1000 // in seconds

		// Allows returning any custom value for any `elapsed` interval.
		// If `options.override()` returns a value (`string`)
		// then this value is returned from this `.format()` call.
		// For example, seconds, minutes and hours can be shown relatively,
		// and other intervals can be shown using full date format.
		// (that's what Twitter style does with its `override()`)
		if (options.override)
		{
			const override = options.override({ elapsed: seconds_elapsed, time, date, now })
			if (override !== undefined)
			{
				return override
			}
		}

		// Available time interval measurement units.
		const units = get_time_interval_measurement_units(locale_data, options.units)

		// If no available time unit is suitable, just output an empty string.
		if (units.length === 0)
		{
			console.error(`Units "${units.join(', ')}" were not found in locale data for "${this.locale}".`)
			return ''
		}

		// Choose the appropriate time measurement unit 
		// and get the corresponding rounded time amount.
		const { unit, amount } = elapsed(Math.abs(seconds_elapsed), units, options.gradation)

		// If no time unit is suitable, just output an empty string.
		// E.g. when "just-now" is not available
		// and "second" has a threshold of `0.5`
		// (e.g. the "canonical" grading scale).
		if (!unit)
		{
			return ''
		}

		// Format the time elapsed.
		return this.get_formatter(unit, flavour).format
		({
			'0'  : amount,
			when : seconds_elapsed >= 0 ? 'past' : 'future'
		})
	}

	// Gets locale messages for this formatting flavour
	get_locale_data(flavour)
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

	// Lazy creation of a formatter of a given `flavour`
	// for a given time measurement `unit`
	// ("second", "minute", "hour", "day", etc).
	get_formatter(unit, flavour)
	{
		// Check if any time unit formatters of this `flavour`
		// have already been created.
		if (!this.formatters[flavour])
		{
			this.formatters[flavour] = {}
		}

		// Get time unit formatters of this `flavour`.
		const time_unit_formatters = this.formatters[flavour]

		// If no time unit formatter of this `flavour`
		// has been previously created for this time `unit`
		// then create and cache it.
		if (!time_unit_formatters[unit])
		{
			time_unit_formatters[unit] = create_formatter
			(
				unit,
				flavour,
				this.locales,
				Javascript_time_ago.locale_data[this.locale]
			)
		}

		return time_unit_formatters[unit]
	}
}

// Adds locale data for a specific locale.
//
// @param {Object} locale_data_input - Locale data.
//
// Locale data being input can either be
// in CLDR format or in this library's format.
//
Javascript_time_ago.locale = function(locale_data_input)
{
	const { locale, locale_data } = parse_locale_data(locale_data_input)

	// This locale data is stored in a global variable
	// and later used when calling `.format(time)`.
	Javascript_time_ago.locale_data[locale] = locale_data

	// The corresponding `intl-messageformat` data for the locale
	// must be added manually by a developer:
	//
	// // Add locale data to IntlMessageFormat
	// // (to be more specific: the `pluralRuleFunction`)
	// require('intl-messageformat/locale-data/ru')
}

// Normalizes `.format()` `time` argument.
function get_date_and_time_being_formatted(input)
{
	if (input.constructor === Date)
	{
		return {
			date : input,
			time : input.getTime()
		}
	}

	if (typeof input === 'number')
	{
		return {
			time : input,
			date : new Date(input)
		}
	}

	// For some weird reason istanbul doesn't see this `throw` covered.
	/* istanbul ignore next */
	throw new Error(`Unsupported relative time formatter input: ${typeof input}, ${input}`)
}

// Get available time interval measurement units.
function get_time_interval_measurement_units(locale_data, restricted_set_of_units)
{
	// All available time interval measurement units.
	const units = Object.keys(locale_data)

	// If only a specific set of available
	// time measurement units can be used.
	if (restricted_set_of_units)
	{
		// Reduce available time interval measurement units
		// based on user's preferences.
		return restricted_set_of_units.filter(_ => units.indexOf(_) >= 0)
	}

	return units
}