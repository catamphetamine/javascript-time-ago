import RelativeTimeFormatPolyfill from 'relative-time-format'

import Cache from './cache'
import chooseLocale from './locale'
import getStep from './steps/getStep'
import getStepDenominator from './steps/getStepDenominator'
import getTimeToNextUpdate from './steps/getTimeToNextUpdate'

import {
	addLocaleData,
	getLocaleData
} from './LocaleDataStore'

// For historical reasons, "approximate" is the default style.
import defaultStyle from './style/approximate'
import getStyleByName from './style/getStyleByName'

// Valid time units.
const UNITS = [
	'now',
	// The rest are the same as in `Intl.RelativeTimeFormat`.
	'second',
	'minute',
	'hour',
	'day',
	'week',
	'month',
	'quarter',
	'year'
]

export default class TimeAgo {
	/**
	 * @param {(string|string[])} locales=[] - Preferred locales (or locale).
	 * @param {boolean} [polyfill] — Pass `false` to use native `Intl.RelativeTimeFormat` and `Intl.PluralRules` instead of the polyfills.
	 */
	constructor(locales = [], { polyfill } = {}) {
		// Convert `locales` to an array.
		if (typeof locales === 'string') {
			locales = [locales]
		}

		// Choose the most appropriate locale
		// from the list of `locales` added by the user.
		// For example, new TimeAgo("en-US") -> "en".
		this.locale = chooseLocale(
			locales.concat(TimeAgo.getDefaultLocale()),
			getLocaleData
		)

		if (typeof Intl !== 'undefined') {
			// Use `Intl.NumberFormat` for formatting numbers (when available).
			if (Intl.NumberFormat) {
				this.numberFormat = new Intl.NumberFormat(this.locale)
			}
		}

		// Some people have requested the ability to use native
		// `Intl.RelativeTimeFormat` and `Intl.PluralRules`
		// instead of the polyfills.
		// https://github.com/catamphetamine/javascript-time-ago/issues/21
		if (polyfill === false) {
			this.IntlRelativeTimeFormat = Intl.RelativeTimeFormat
			this.IntlPluralRules = Intl.PluralRules
		} else {
			this.IntlRelativeTimeFormat = RelativeTimeFormatPolyfill
			this.IntlPluralRules = RelativeTimeFormatPolyfill.PluralRules
		}

		// Cache `Intl.RelativeTimeFormat` instance.
		this.relativeTimeFormatCache = new Cache()

		// Cache `Intl.PluralRules` instance.
		this.pluralRulesCache = new Cache()
	}

	/**
	 * Formats relative date/time.
	 *
	 * @param {number} [options.now] - Sets the current date timestamp.
	 *
	 * @param  {boolean} [options.future] — Tells how to format value `0`:
	 *         as "future" (`true`) or "past" (`false`).
	 *         Is `false` by default, but should have been `true` actually,
	 *         in order to correspond to `Intl.RelativeTimeFormat`
	 *         that uses `future` formatting for `0` unless `-0` is passed.
	 *
	 * @param {boolean} [options.getTimeToNextUpdate] — Pass `true` to return `[formattedDate, timeToNextUpdate]` instead of just `formattedDate`.
	 *
	 * @return {string} The formatted relative date/time. If no eligible `step` is found, then an empty string is returned.
	 */
	format(input, style = defaultStyle, options = {}) {
		if (typeof style === 'string') {
			style = getStyleByName(style)
		}

		const { date, time } = getDateAndTimeBeingFormatted(input)

		// Get locale messages for this type of labels.
		// "flavour" is a legacy name for "labels".
		const { labels, labelsType } = this.getLabels(style.flavour || style.labels)

		let now
		// Can pass a custom `now`, e.g. for testing purposes.
		//
		// Legacy way was passing `now` in `style`.
		// That way is deprecated.
		if (style.now !== undefined) {
			now = style.now
		}
		// The new way is passing `now` option to `.format()`.
		if (now === undefined && options.now !== undefined) {
			now = options.now
		}
		if (now === undefined) {
			now = Date.now()
		}

		// how much time has passed (in seconds)
		const secondsPassed = (now - time) / 1000 // in seconds

		const future = options.future || secondsPassed < 0

		const nowLabel = getNowLabel(
			labels,
			getLocaleData(this.locale).now,
			getLocaleData(this.locale).long,
			future
		)

		// `custom` – A function of `{ elapsed, time, date, now, locale }`.
		//
		// Looks like `custom` function is deprecated and will be removed
		// in the next major version.
		//
		// If this function returns a value, then the `.format()` call will return that value.
		// Otherwise the relative date/time is formatted as usual.
		// This feature is currently not used anywhere and is here
		// just for providing the ultimate customization point
		// in case anyone would ever need that. Prefer using
		// `steps[step].format(value, locale)` instead.
		//
		if (style.custom) {
			const custom = style.custom({
				now,
				date,
				time,
				elapsed: secondsPassed,
				locale: this.locale
			})
			if (custom !== undefined) {
				// Won't return `timeToNextUpdate` here
				// because `custom()` seems deprecated.
				return custom
			}
		}

		// Get the list of available time interval units.
		const units = getTimeIntervalMeasurementUnits(
			// Controlling `style.steps` through `style.units` seems to be deprecated:
			// create a new custom `style` instead.
			style.units,
			labels,
			nowLabel
		)

		// // If no available time unit is suitable, just output an empty string.
		// if (units.length === 0) {
		// 	console.error(`None of the "${units.join(', ')}" time units have been found in "${labelsType}" labels for "${this.locale}" locale.`)
		// 	return ''
		// }

		// Choose the appropriate time measurement unit
		// and get the corresponding rounded time amount.
		const [step, nextStep] = getStep(
			// "gradation" is a legacy name for "steps".
			// For historical reasons, "approximate" steps are used by default.
			// In the next major version, there'll be no default for `steps`.
			style.gradation || style.steps || defaultStyle.gradation,
			secondsPassed,
			{ now, units, future, getNextStep: true }
		)

		const formattedDate = this.formatDateForStep(date || time, step, secondsPassed, {
			labels,
			labelsType,
			nowLabel,
			now,
			future
		}) || ''

		if (options.getTimeToNextUpdate) {
			const timeToNextUpdate = step && getTimeToNextUpdate(date || time, step, {
				nextStep,
				now,
				future
			})
			return [formattedDate, timeToNextUpdate]
		}

		return formattedDate
	}

	formatDateForStep(dateOrTimestamp, step, secondsPassed, {
		labels,
		labelsType,
		nowLabel,
		now,
		future
	}) {
		// If no step matches, then output an empty string.
		if (!step) {
			return
		}

		if (step.format) {
			return step.format(dateOrTimestamp, this.locale, {
				formatAs: (unit, value) => {
					// Mimicks `Intl.RelativeTimeFormat.format()`.
					return this.formatValue(value, unit, {
						labels,
						future
					})
				},
				now,
				future
			})
		}

		// "unit" is now called "formatAs".
		const unit = step.unit || step.formatAs

		if (!unit) {
			throw new Error(`[javascript-time-ago] Each step must define either \`formatAs\` or \`format()\`. Step: ${JSON.stringify(step)}`)
		}

		// `Intl.RelativeTimeFormat` doesn't operate in "now" units.
		// Therefore, threat "now" as a special case.
		if (unit === 'now') {
			return nowLabel
		}

		// Amount in units.
		let amount = Math.abs(secondsPassed) / getStepDenominator(step)

		// Apply granularity to the time amount
		// (and fallback to the previous step
		//  if the first level of granularity
		//  isn't met by this amount)
		//
		// `granularity` — (advanced) Time interval value "granularity".
		// For example, it could be set to `5` for minutes to allow only 5-minute increments
		// when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc.
		// Perhaps this feature will be removed because there seem to be no use cases
		// of it in the real world.
		//
		if (step.granularity) {
			// Recalculate the amount of seconds passed based on granularity
			amount = Math.round(amount / step.granularity) * step.granularity
		}

		let valueForFormatting = -1 * Math.sign(secondsPassed) * Math.round(amount)

		// By default, this library formats a `0` in "past" mode,
		// unless `future: true` option is passed.
		// This is different to `relative-time-format`'s behavior
		// which formats a `0` in "future" mode by default, unless it's a `-0`.
		// So, convert `0` to `-0` if `future: true` option wasn't passed.
		// `=== 0` matches both `0` and `-0`.
		if (valueForFormatting === 0) {
			if (future) {
				valueForFormatting = 0
			} else {
				valueForFormatting = -0
			}
		}

		switch (labelsType) {
			case 'long':
			case 'short':
			case 'narrow':
				// Format the amount using `Intl.RelativeTimeFormat`.
				return this.getFormatter(labelsType).format(valueForFormatting, unit)
			default:
				// Format the amount.
				// (mimicks `Intl.RelativeTimeFormat` behavior for other time label styles)
				return this.formatValue(valueForFormatting, unit, {
					labels,
					future
				})
		}
	}

	/**
	 * Mimicks what `Intl.RelativeTimeFormat` does for additional locale styles.
	 * @param  {number} value
	 * @param  {string} unit
	 * @param  {object} options.labels — Relative time labels.
	 * @param  {boolean} [options.future] — Tells how to format value `0`: as "future" (`true`) or "past" (`false`). Is `false` by default, but should have been `true` actually.
	 * @return {string}
	 */
	formatValue(value, unit, { labels, future }) {
		return this.getFormattingRule(labels, unit, value, { future })
			.replace('{0}', this.formatNumber(Math.abs(value)))
	}

	/**
	 * Returns formatting rule for `value` in `units` (either in past or in future).
	 * @param {object} formattingRules — Relative time labels for different units.
	 * @param {string} unit - Time interval measurement unit.
	 * @param {number} value - Time interval value.
	 * @param  {boolean} [options.future] — Tells how to format value `0`: as "future" (`true`) or "past" (`false`). Is `false` by default.
	 * @return {string}
	 * @example
	 * // Returns "{0} days ago"
	 * getFormattingRule(en.long, "day", -2, 'en')
	 */
	getFormattingRule(formattingRules, unit, value, { future }) {
		// Passing the language is required in order to
		// be able to correctly classify the `value` as a number.
		const locale = this.locale
		formattingRules = formattingRules[unit]
		// Check for a special "compacted" rules case:
		// if formatting rules are the same for "past" and "future",
		// and also for all possible `value`s, then those rules are
		// stored as a single string.
		if (typeof formattingRules === 'string') {
			return formattingRules
		}
		// Choose either "past" or "future" based on time `value` sign.
		// If "past" is same as "future" then they're stored as "other".
		// If there's only "other" then it's being collapsed.
		const pastOrFuture = value === 0 ? (future ? 'future' : 'past') : (value < 0 ? 'past' : 'future')
		const quantifierRules = formattingRules[pastOrFuture] || formattingRules
		// Bundle size optimization technique.
		if (typeof quantifierRules === 'string') {
			return quantifierRules
		}
		// Quantify `value`.
		const quantifier = this.getPluralRules().select(Math.abs(value))
		// "other" rule is supposed to always be present.
		// If only "other" rule is present then "rules" is not an object and is a string.
		return quantifierRules[quantifier] || quantifierRules.other
	}

	/**
	 * Formats a number into a string.
	 * Uses `Intl.NumberFormat` when available.
	 * @param  {number} number
	 * @return {string}
	 */
	formatNumber(number) {
		return this.numberFormat ? this.numberFormat.format(number) : String(number)
	}

	/**
	 * Returns an `Intl.RelativeTimeFormat` for a given `labelsType`.
	 * @param {string} labelsType
	 * @return {object} `Intl.RelativeTimeFormat` instance
	 */
	getFormatter(labelsType) {
		// `Intl.RelativeTimeFormat` instance creation is (hypothetically) assumed
		// a lengthy operation so the instances are cached and reused.
		return this.relativeTimeFormatCache.get(this.locale, labelsType) ||
			this.relativeTimeFormatCache.put(this.locale, labelsType, new this.IntlRelativeTimeFormat(this.locale, { style: labelsType }))
	}

	/**
	 * Returns an `Intl.PluralRules` instance.
	 * @return {object} `Intl.PluralRules` instance
	 */
	getPluralRules() {
		// `Intl.PluralRules` instance creation is (hypothetically) assumed
		// a lengthy operation so the instances are cached and reused.
		return this.pluralRulesCache.get(this.locale) ||
			this.pluralRulesCache.put(this.locale, new this.IntlPluralRules(this.locale))
	}


	/**
	 * Gets localized labels for this type of labels.
	 *
	 * @param {(string|string[])} labelsType - Relative date/time labels type.
	 *                                     If it's an array then all label types are tried
	 *                                     until a suitable one is found.
	 *
	 * @returns {Object} Returns an object of shape { labelsType, labels }
	 */
	getLabels(labelsType = []) {
		// Convert `labels` to an array.
		if (typeof labelsType === 'string') {
			labelsType = [labelsType]
		}

		// "long" labels type is the default one.
		// (it's always present for all languages)
		labelsType = labelsType.concat('long')

		// Find a suitable labels type.
		const localeData = getLocaleData(this.locale)
		for (const _labelsType of labelsType) {
			if (localeData[_labelsType]) {
				return {
					labelsType: _labelsType,
					labels: localeData[_labelsType]
				}
			}
		}
	}
}

/**
 * Default locale global variable.
 */
let defaultLocale = 'en'

/**
 * Gets default locale.
 * @return  {string} locale
 */
TimeAgo.getDefaultLocale = () => defaultLocale

/**
 * Sets default locale.
 * @param  {string} locale
 */
TimeAgo.setDefaultLocale = (locale) => defaultLocale = locale

/**
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 */
TimeAgo.addDefaultLocale = function(localeData) {
	if (defaultLocaleHasBeenSpecified) {
		throw new Error('[javascript-time-ago] `TimeAgo.addDefaultLocale()` can only be called once. To add other locales, use `TimeAgo.addLocale()`.')
	}
	defaultLocaleHasBeenSpecified = true
	TimeAgo.setDefaultLocale(localeData.locale)
	TimeAgo.addLocale(localeData)
}

let defaultLocaleHasBeenSpecified

/**
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 */
TimeAgo.addLocale = function(localeData) {
	addLocaleData(localeData)
	RelativeTimeFormatPolyfill.addLocale(localeData)
}

/**
 * (legacy alias)
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 * @deprecated
 */
TimeAgo.locale = TimeAgo.addLocale

/**
 * Adds custom labels to locale data.
 * @param {string} locale
 * @param {string} name
 * @param {object} labels
 */
TimeAgo.addLabels = (locale, name, labels) => {
	const localeData = getLocaleData(locale)
	if (!localeData) {
		throw new Error(`[javascript-time-ago] No data for locale "${locale}"`)
	}
	localeData[name] = labels
}

// Normalizes `.format()` `time` argument.
function getDateAndTimeBeingFormatted(input) {
	if (input.constructor === Date || isMockedDate(input)) {
		return {
			date : input,
			time : input.getTime()
		}
	}

	if (typeof input === 'number') {
		return {
			time : input,
			// `date` is not required for formatting
			// relative times unless "twitter" style is used.
			// date : new Date(input)
		}
	}

	// For some weird reason istanbul doesn't see this `throw` covered.
	/* istanbul ignore next */
	throw new Error(`Unsupported relative time formatter input: ${typeof input}, ${input}`)
}

// During testing via some testing libraries `Date`s aren't actually `Date`s.
// https://github.com/catamphetamine/javascript-time-ago/issues/22
function isMockedDate(object) {
	return typeof object === 'object' && typeof object.getTime === 'function'
}

// Get available time interval measurement units.
function getTimeIntervalMeasurementUnits(allowedUnits, labels, nowLabel) {
	// Get all time interval measurement units that're available
	// in locale data for a given time labels style.
	let units = Object.keys(labels)

	// `now` unit is handled separately and is shipped in its own `now.json` file.
	// `now.json` isn't present for all locales, so it could be substituted with
	// ".second.current".
	// Add `now` unit if it's available in locale data.
	if (nowLabel) {
		units.push('now')
	}

	// If only a specific set of available time measurement units can be used
	// then only those units are allowed (if they're present in locale data).
	if (allowedUnits) {
		units = allowedUnits.filter(unit => unit === 'now' || units.indexOf(unit) >= 0)
	}

	return units
}

function getNowLabel(labels, nowLabels, longLabels, future) {
	const nowLabel = labels.now || (nowLabels && nowLabels.now)
	// Specific "now" message form extended locale data (if present).
	if (nowLabel) {
		// Bundle size optimization technique.
		if (typeof nowLabel === 'string') {
			return nowLabel
		}
		// Not handling `value === 0` as `localeData.now.current` here
		// because it wouldn't make sense: "now" is a moment,
		// so one can't possibly differentiate between a
		// "previous" moment, a "current" moment and a "next moment".
		// It can only be differentiated between "past" and "future".
		if (future) {
			return nowLabel.future
		} else {
			return nowLabel.past
		}
	}
	// Use ".second.current" as "now" message.
	// If this function was called then it means that
	// either "now" unit messages are available or
	// ".second.current" message is present.
	return longLabels.second.current
}