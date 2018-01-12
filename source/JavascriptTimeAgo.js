import grade from './grade'
import choose_locale from './locale'
import { twitterStyle, timeStyle, defaultStyle } from './style'
import RelativeTimeFormat from './RelativeTimeFormat'

export default class JavascriptTimeAgo
{
	// Fallback locale
	// (when not a single supplied preferred locale is available)
	static default_locale = 'en'

	// For all configured locales
	// their relative time formatter messages will be stored here
	static locales = {}

	/**
	 * @param {(string|string[])} locales=[] - Preferred locales (or locale).
	 */
	constructor(locales = [])
	{
		// Convert `locales` to an array.
		if (typeof locales === 'string')
		{
			locales = [locales]
		}

		// Choose the most appropriate locale
		// (one of the previously added ones)
		// based on the list of preferred `locales` supplied by the user.
		this.locale = choose_locale
		(
			locales.concat(JavascriptTimeAgo.default_locale),
			JavascriptTimeAgo.locales
		)
	}

	// Formats the relative date/time.
	//
	// @return {string} Returns the formatted relative date/time.
	//
	// @param {(Object|string)} [style] - Relative date/time formatting style.
	//
	// @param {string[]} [style.units] - A list of allowed time units
	//                                  (e.g. ['second', 'minute', 'hour', …])
	//
	// @param {Function} [style.custom] - `function ({ elapsed, time, date, now })`.
	//                                    If this function returns a value, then
	//                                    the `.format()` call will return that value.
	//                                    Otherwise it has no effect.
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
	format(input, style = defaultStyle)
	{
		if (typeof style === 'string')
		{
			switch (style)
			{
				case 'twitter':
					style = twitterStyle
					break
				case 'time':
					style = timeStyle
					break
				default:
					style = defaultStyle
			}
		}

		const { date, time } = get_date_and_time_being_formatted(input)

		// Get locale messages for this formatting flavour
		const { flavour, locale_data } = this.get_locale_data(style.flavour)

		// Can pass a custom `now`, e.g. for testing purposes.
		// Technically it doesn't belong to `style`
		// but since this is an undocumented internal feature,
		// taking it from the `style` argument will do (for now).
		const now = style.now || Date.now()

		// how much time elapsed (in seconds)
		const elapsed = (now - time) / 1000 // in seconds

		// Allows returning any custom value for any `elapsed` interval.
		// If `style.custom()` returns a value (`string`)
		// then this value is returned from this `.format()` call.
		// For example, seconds, minutes and hours can be shown relatively,
		// and other intervals can be shown using full date format.
		// (that's what Twitter style does with its `custom()`)
		if (style.custom)
		{
			const custom = style.custom
			({
				now,
				date,
				time,
				elapsed,
				locale : this.locale
			})

			if (custom !== undefined)
			{
				return custom
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
		const step = grade
		(
			Math.abs(elapsed),
			now,
			units,
			style.gradation
		)

		// If no time unit is suitable, just output an empty string.
		// E.g. when "now" unit is not available
		// and "second" has a threshold of `0.5`
		// (e.g. the "canonical" grading scale).
		if (!step)
		{
			return ''
		}

		if (step.format)
		{
			return step.format(date || time, this.locale)
		}

		const { unit, factor, granularity } = step

		let amount = Math.abs(elapsed) / factor

		// Apply granularity to the time amount
		// (and fallback to the previous step
		//  if the first level of granularity
		//  isn't met by this amount)
		if (granularity)
		{
			// Recalculate the elapsed time amount based on granularity
			amount = Math.round(amount / granularity) * granularity
		}

		// Format the time elapsed.
		// Using `Intl.RelativeTimeFormat` proposal polyfill.
		//
		// TODO: Should cache `Intl.RelativeTimeFormat` instances
		// for given `this.locale` and `flavour`.
		//
		// ```js
		// import Cache from './cache'
		// const cache = new Cache()
		// const formatter = this.cache.get(this.locale, flavour) ||
		//   this.cache.put(this.locale, flavour, new Intl.RelativeTimeFormat(...))
		// return formatter.format(...)
		// ```
		//
		return new RelativeTimeFormat(this.locale, { style: flavour }).format
		(
			-1 * Math.sign(elapsed) * Math.round(amount),
			unit
		)
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
		const locale_data = JavascriptTimeAgo.locales[this.locale]

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

/**
 * Sets default locale.
 * @param  {string} locale
 */
JavascriptTimeAgo.setDefaultLocale = function(locale)
{
	JavascriptTimeAgo.default_locale = locale
}

// Adds locale data for a specific locale.
//
// @param {Object} locale_data - Locale data.
//
JavascriptTimeAgo.locale = function(locale_data)
{
	// This locale data is stored in a global variable
	// and later used when calling `.format(time)`.
	JavascriptTimeAgo.locales[locale_data.locale] = locale_data
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
			// `date` is not required for formatting
			// relative times unless "twitter" preset is used.
			// date : new Date(input)
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