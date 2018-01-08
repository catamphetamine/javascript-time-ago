import elapsed       from './elapsed'
import styles        from './style'
import choose_locale from './locale'

export default class JavascriptTimeAgo
{
	// Fallback locale
	// (when not a single supplied preferred locale is available)
	static default_locale = 'en'

	// For all configured locales
	// their relative time formatter messages will be stored here
	static locale_data = {}

	constructor(locales = [])
	{
		if (typeof locales === 'string')
		{
			locales = [locales]
		}

		// The preferred locales are saved
		// to be later passed to `IntlMessageFormat`
		// when creating formatters lazily.
		this.locales = locales.concat(JavascriptTimeAgo.default_locale)

		// Choose the most appropriate locale
		// (one of the previously added ones)
		// based on the list of preferred `locales` supplied by the user.
		this.locale = choose_locale
		(
			this.locales,
			Object.keys(JavascriptTimeAgo.locale_data)
		)
	}

	// Formats the relative date/time.
	//
	// @return {string} Returns the formatted relative date/time.
	//
	// @param {Object} [style] - Relative date/time formatting style.
	//
	// @param {string[]} [style.units] - A list of allowed time units
	//                                  (e.g. ['second', 'minute', 'hour', …])
	//
	// @param {Function} [style.override] - `function ({ elapsed, time, date, now })`.
	//                                      If the `override` function returns a value,
	//                                      then the `.format()` call will return that value.
	//                                      Otherwise it has no effect.
	//
	// @param {string} [style.flavour] - e.g. "long", "short", "tiny", etc.
	//
	// @param {Object[]} [style.gradation] - Time scale gradation steps.
	//
	// @param {string} style.gradation[].unit - Time interval measurement unit.
	//                                          (e.g. ['second', 'minute', 'hour', …])
	//
	// @param {Number} style.gradation[].factor - Time interval measurement unit factor.
	//                                            (e.g. `60` for 'minute')
	//
	// @param {Number} [style.gradation[].granularity] - A step for the unit's "amount" value.
	//                                                   (e.g. `5` for '0 minutes', '5 minutes', etc)
	//
	// @param {Number} [style.gradation[].threshold] - Time interval measurement unit threshold.
	//                                                 (e.g. `45` seconds for 'minute').
	//                                                 There can also be specific `threshold_[unit]`
	//                                                 thresholds for fine-tuning.
	//
	format(input, style = {})
	{
		if (typeof style === 'string')
		{
			style = styles[style](this.locale)
		}

		const { date, time } = get_date_and_time_being_formatted(input)

		// Get locale messages for this formatting flavour
		const { locale_data } = this.get_locale_data(style.flavour)

		// Can pass a custom `now`, e.g. for testing purposes.
		// Technically it doesn't belong to `style`
		// but since this is an undocumented internal feature,
		// taking it from the `style` argument will do (for now).
		const now = style.now || Date.now()

		// how much time elapsed (in seconds)
		const seconds_elapsed = (now - time) / 1000 // in seconds

		// Allows returning any custom value for any `elapsed` interval.
		// If `style.override()` returns a value (`string`)
		// then this value is returned from this `.format()` call.
		// For example, seconds, minutes and hours can be shown relatively,
		// and other intervals can be shown using full date format.
		// (that's what Twitter style does with its `override()`)
		if (style.override)
		{
			const override = style.override({ elapsed: seconds_elapsed, time, date, now })
			if (override !== undefined)
			{
				return override
			}
		}

		// Available time interval measurement units.
		const units = get_time_interval_measurement_units(locale_data, style.units)

		// If no available time unit is suitable, just output an empty string.
		if (units.length === 0)
		{
			console.error(`Units "${units.join(', ')}" were not found in locale data for "${this.locale}".`)
			return ''
		}

		// Choose the appropriate time measurement unit 
		// and get the corresponding rounded time amount.
		const { unit, amount } = elapsed(Math.abs(seconds_elapsed), units, style.gradation)

		// If no time unit is suitable, just output an empty string.
		// E.g. when "just-now" is not available
		// and "second" has a threshold of `0.5`
		// (e.g. the "canonical" grading scale).
		if (!unit)
		{
			return ''
		}

		// Get locale-specific time interval formatting rules
		// of a given `flavour`
		// for the given time interval measurement `unit`.
		//
		// E.g.:
		//
		// ```json
		// {
		// 	"past": {
		// 		"one": "a second ago",
		// 		"other": "{0} seconds ago"
		// 	},
		// 	"future": {
		// 		"one": "in a second",
		// 		"other": "in {0} seconds"
		// 	}
		// }
		// ```
		//
		// Then choose either "past" or "future" based on time elapsed sign.
		//
		const rules = locale_data[unit][seconds_elapsed >= 0 ? 'past' : 'future']

		// Format the time elapsed.
		// Get pluralization classifier function.
		const plurals_classifier = JavascriptTimeAgo.locale_data[this.locale].plural
		// "other" rule is supposed to always be present
		const rule = rules[plurals_classifier(amount)] || rules.other
		// Inject the amount
		return rule.replace('{0}', amount)
	}

	/**
	 * Gets locale messages for this formatting flavour
	 *
	 * @param {(string|string[])} flavour - Relative date/time formatting flavour.
	 *                                      If it's an array then all flavours are tried in order.
	 *
	 * @returns {Object} Returns an object of shape { flavour, locale_data }
	 */
	get_locale_data(flavour = [])
	{
		// Get relative time formatting rules for this locale
		const locale_data = JavascriptTimeAgo.locale_data[this.locale]

		// Convert `flavour` to an array.
		if (typeof flavour === 'string')
		{
			flavour = [flavour]
		}

		// "long" flavour is the default one.
		// (it's always present)
		flavour = flavour.concat('long')

		// Find a suitable flavour.
		for (const _ of flavour)
		{
			if (locale_data[_])
			{
				return {
					flavour     : _,
					locale_data : locale_data[_]
				}
			}
		}

		// Can't happen - "long" flavour is always present.
		// throw new Error(`None of the flavours - ${flavour.join(', ')} - was found for locale "${this.locale}".`)
	}
}

// Adds locale data for a specific locale.
//
// @param {Object} locale_data - Locale data.
//
JavascriptTimeAgo.locale = function(locale_data)
{
	// This locale data is stored in a global variable
	// and later used when calling `.format(time)`.
	JavascriptTimeAgo.locale_data[locale_data.locale] = locale_data
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