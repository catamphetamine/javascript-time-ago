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
// 		"second":
// 		{
// 			"future":
// 			{
// 				"one": "in a second",
// 				"other": "in {0} seconds"
// 			},
// 			"past":
// 			{
// 				"one": "a second ago",
// 				"other": "{0} seconds ago"
// 			}
// 		},
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
	// The generic time measurement units
	// (other units like "quarter" or "thu" are ignored).
	const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']

	// Detects the short flavour of labels (yr., mo., etc).
	// E.g. for English there are "month", "month-short", "month-narrow".
	// Out of these three only the regular one and the "short" one are used.
	const short = /-short$/

	// Extract `locale` from CLDR data
	const locale = Object.keys(data.main)[0]
	const time_units_formatting_rules = data.main[locale].dates.fields

	return Object.keys(time_units_formatting_rules)
	.filter((unit) =>
	{
		// Take only the generic time measurement units
		// (skip exotic ones like "quarter" on "thu").
		return units.indexOf(unit) >= 0 || units.indexOf(unit.replace(short, '')) >= 0
	})
	.reduce((locale_data, unit) =>
	{
		const time_unit_formatting_rules = time_units_formatting_rules[unit]
		const parsed_time_unit_formatting_rules = {}

		// If a `unit` ends with `-short`
		// then it's a "short" flavour of this unit.
		if (short.test(unit))
		{
			if (!locale_data.short)
			{
				locale_data.short = {}
			}

			locale_data.short[unit.replace(short, '')] = parsed_time_unit_formatting_rules
		}
		else
		{
			locale_data.long[unit] = parsed_time_unit_formatting_rules
		}

		// the "relative" values aren't suitable for "ago" or "in a" cases,
		// because "1 year ago" != "last year" (too vague for Jan 30th)
		// and "in 0.49 years" != "this year" (it could be Nov 30th).

		// if (time_unit_formatting_rules['relative-type--1'])
		// {
		// 	parsed_time_unit_formatting_rules.previous = time_unit_formatting_rules['relative-type--1']
		// }

		// if (time_unit_formatting_rules['relative-type-0'])
		// {
		// 	parsed_time_unit_formatting_rules.current = time_unit_formatting_rules['relative-type-0']
		// }

		// if (time_unit_formatting_rules['relative-type-1'])
		// {
		// 	parsed_time_unit_formatting_rules.next = entry['relative-type-1']
		// }

		// Use "now" for "second"s from CLDR as "just-now" formatting rule.
		if (unit === 'second' || unit === 'second-short')
		{
			const now = time_unit_formatting_rules['relative-type-0']

			/* istanbul ignore else */
			if (now)
			{
				locale_data[short.test(unit) ? 'short' : 'long']['just-now'] =
				{
					past   : { other : now },
					future : { other : now }
				}
			}
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
		if (time_unit_formatting_rules['relativeTime-type-past'])
		{
			const past = time_unit_formatting_rules['relativeTime-type-past']
			parsed_time_unit_formatting_rules.past = {}

			for (const count_classifier of Object.keys(past))
			{
				parsed_time_unit_formatting_rules.past
				[
					count_classifier.replace('relativeTimePattern-count-', '')
				]
				= past[count_classifier]
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
		if (time_unit_formatting_rules['relativeTime-type-future'])
		{
			const future = time_unit_formatting_rules['relativeTime-type-future']
			parsed_time_unit_formatting_rules.future = {}

			for (const count_classifier of Object.keys(future))
			{
				parsed_time_unit_formatting_rules.future
				[
					count_classifier.replace('relativeTimePattern-count-', '')
				]
				= future[count_classifier]
			}
		}

		return locale_data
	},
	// Parsed locale data
	{ long: {} })
}