// import { isEqual } from 'lodash'

// The generic time measurement units.
// (other units like "fri" or "thu" are ignored)
// ("quarter" is required by `Intl.RelativeTimeFormat`)
export const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year']

// Detects short and narrow flavours of labels (yr., mo., etc).
// E.g. there are "month", "month-short", "month-narrow".
// More on "narrow" vs "short":
// http://cldr.unicode.org/translation/plurals#TOC-Narrow-and-Short-Forms
const short = /-short$/
const narrow = /-narrow$/

// Converts locale data from CLDR format to this library's format.
//
// CLDR locale data example:
//
// ```json
// {
//   "main": {
//     "en-US-POSIX": {
//       "identity": {
//         "language": "en",
//         ...
//       },
//       "dates": {
//         "fields": {
//           "year": {
//             "displayName": "year",
//             "relative-type--1": "last year",
//             "relative-type-0": "this year",
//             "relative-type-1": "next year",
//             "relativeTime-type-future": {
//               "relativeTimePattern-count-one": "in {0} year",
//               "relativeTimePattern-count-other": "in {0} years"
//             },
//             "relativeTime-type-past": {
//               "relativeTimePattern-count-one": "{0} year ago",
//               "relativeTimePattern-count-other": "{0} years ago"
//             }
//           },
// ...
// ```
//
// Parsed locale data example:
//
// ```json
// {
// 	"long":
// 	{
// 		...
// 		"second": [
// 			{
// 				"one": "a second ago",
// 				"other": "{0} seconds ago"
// 			},
// 			{
// 				"one": "in a second",
// 				"other": "in {0} seconds"
// 			}
// 		],
// 		...
// 	},
// 	"short":
// 	{
// 		...
// 	},
// 	...
// }
// ```
export default function parse_CLDR(data)
{
	// Extract `locale` from CLDR data
	const locale = Object.keys(data.main)[0]
	const time_units_formatting_rules = data.main[locale].dates.fields

	return Object.keys(time_units_formatting_rules)
	.filter((unit) =>
	{
		// Take only the generic time measurement units
		// (skip exotic ones like "fri" on "thu").
		return units.indexOf(parse_unit(unit).unit) >= 0
	})
	.reduce((locale_data, _unit) =>
	{
		const { unit, type } = parse_unit(_unit)
		return set_unit_rules(locale_data, type, unit, parse_CLDR_time_unit_formatting_rules(time_units_formatting_rules[_unit]))
	},
	// Parsed locale data
	{})
}

/**
 * Parses CLDR time unit formatting rules.
 * @param  {object} - CLDR time unit formatting rules.
 * @return {(object|string)}
 */
function parse_CLDR_time_unit_formatting_rules(rules_CLDR)
{
	let rules = {}

	// "relative" values aren't suitable for "ago" or "in a" cases,
	// because "1 year ago" != "last year" (too vague for Jan 30th)
	// and "in 0.49 years" != "this year" (it could be Nov 30th).
	// Still including them here for `Intl.RelativeTimeFormat` polyfill.

	// "yesterday"
	if (rules_CLDR['relative-type--1'])
	{
		rules.previous = rules_CLDR['relative-type--1']
	}

	// "today"
	/* istanbul ignore else */
	if (rules_CLDR['relative-type-0'])
	{
		rules.current = rules_CLDR['relative-type-0']
	}

	// "tomorrow"
	if (rules_CLDR['relative-type-1'])
	{
		rules.next = rules_CLDR['relative-type-1']
	}

	// Formatting past times.
	//
	// E.g.:
	//
	// "relativeTime-type-past":
	// {
	// 	"relativeTimePattern-count-one": "{0} mo. ago",
	// 	"relativeTimePattern-count-other": "{0} mo. ago"
	// }
	//
	/* istanbul ignore else */
	if (rules_CLDR['relativeTime-type-past'])
	{
		const past = rules_CLDR['relativeTime-type-past']
		rules.past = {}

		// Populate all quantifiers ("one", "other", etc).
		for (const quantifier of Object.keys(past))
		{
			rules.past
			[
				quantifier.replace('relativeTimePattern-count-', '')
			]
			= past[quantifier]
		}

		// Delete all duplicates of "other" rule.
		for (const quantifier of Object.keys(rules.past))
		{
			if (quantifier !== 'other' && rules.past[quantifier] === rules.past.other)
			{
				delete rules.past[quantifier]
			}
		}

 		// If only "other" rule is present then "rules" is not an object and is a string.
		if (Object.keys(rules.past).length === 1)
		{
			rules.past = rules.past.other
		}
	}

	// Formatting future times.
	//
	// E.g.:
	//
	// "relativeTime-type-future":
	// {
	// 	"relativeTimePattern-count-one": "in {0} mo.",
	// 	"relativeTimePattern-count-other": "in {0} mo."
	// }
	//
	/* istanbul ignore else */
	if (rules_CLDR['relativeTime-type-future'])
	{
		const future = rules_CLDR['relativeTime-type-future']
		rules.future = {}

		// Populate all quantifiers ("one", "other", etc).
		for (const quantifier of Object.keys(future))
		{
			rules.future
			[
				quantifier.replace('relativeTimePattern-count-', '')
			]
			= future[quantifier]
		}

		// Delete all duplicates of "other" rule.
		for (const quantifier of Object.keys(rules.future))
		{
			if (quantifier !== 'other' && rules.future[quantifier] === rules.future.other)
			{
				delete rules.future[quantifier]
			}
		}

 		// If only "other" rule is present then "rules" is not an object and is a string.
		if (Object.keys(rules.future).length === 1)
		{
			rules.future = rules.future.other
		}
	}

	// // If `.past` === `.future` then replace them with `.other`.
	// // (only eligible for "tiny" and "*-time" locale data which is not part of CLDR)
	// if (isEqual(rules.past, rules.future))
	// {
	// 	rules.other = rules.past
	// 	delete rules.future
	// }

	// // If only "other" rule is defined for a time unit
	// // then make "rules" a string rather than an object.
	// if (Object.keys(rules).length === 1)
	// {
	// 	rules = rules.other
	// }

	return rules
}

/**
 * Sets time unit formatting rules in locale data.
 * @param {object} locale_data
 * @param {string} type
 * @param {string} unit
 * @param {object} rules
 * @return {object} Locale data.
 */
function set_unit_rules(locale_data, type, unit, rules)
{
	if (!locale_data[type])
	{
		locale_data[type] = {}
	}

	locale_data[type][unit] = rules

	// Populate "now" unit rules.
	if (unit === 'second' && rules.current)
	{
		locale_data[type].now = rules.current
	}

	return locale_data
}

/**
 * Parses CLDR time unit into `unit` and `type`.
 * @param  {string} CLDR_unit
 * @return {object} `{ type, unit }`.
 */
function parse_unit(unit)
{
	if (narrow.test(unit))
	{
		return { type: 'narrow', unit: unit.replace(narrow, '') }
	}

	if (short.test(unit))
	{
		return { type: 'short', unit: unit.replace(short, '') }
	}

	return { type: 'long', unit }
}