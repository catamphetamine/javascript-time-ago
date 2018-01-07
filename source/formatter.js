import IntlMessageFormat from 'intl-messageformat'

// Creates relative time formatters of a given `flavour`
// for the specified time measurement `unit`.
// ("second", "minute", "hour", "day", etc)
//
// @return {Object} formatter - an `IntlMessageFormat` instance.
//
export default function create_formatter(unit, flavour, locales, cache)
{
	// Get locale-specific time interval formatter messages
	// of a given `flavour`
	// for the given time interval measurement `unit`.
	//
	// E.g.:
	//
	// ```json
	// {
	// 	"future": {
	// 		"one": "in a second",
	// 		"other": "in {0} seconds"
	// 	},
	// 	"past": {
	// 		"one": "a second ago",
	// 		"other": "{0} seconds ago"
	// 	}
	// }
	// ```
	const unit_formatting_rules = cache[flavour][unit]

	// Generate `format.js` (the library) number formatting rules.
	// E.g. "one {# second ago} other {# seconds ago}".
	let past_formatting_rules   = ''
	let future_formatting_rules = ''

	// Compose "past" formatter specification.
	// (replacing CLDR number placeholder "{0}" 
	//  with format.js number placeholder "#").
	// E.g. "one {# second ago} other {# seconds ago}".
	for (const count_classifier of Object.keys(unit_formatting_rules.past))
	{
		// e.g. += " one {in # second}"
		past_formatting_rules += ` ${count_classifier} 
				{${unit_formatting_rules.past[count_classifier].replace('{0}', '#')}}`
	}

	// Compose "future" formatter specification.
	// (replacing CLDR number placeholder "{0}" 
	//  with format.js number placeholder "#").
	// E.g. "one {# second ago} other {# seconds ago}".
	for (const count_classifier of Object.keys(unit_formatting_rules.future))
	{
		// e.g. += " one {# second ago}"
		future_formatting_rules += ` ${count_classifier} 
				{${unit_formatting_rules.future[count_classifier].replace('{0}', '#')}}`
	}

	// The ultimate time interval `format.js` formatting rule.
	// ("0" will be replaced with the first argument
	//  when the message will be formatted).
	const message = `{ when, select, past   {{0, plural, ${past_formatting_rules}}}
	                                 future {{0, plural, ${future_formatting_rules}}} }`

	// Create an `IntlMessageFormat` instance 
	// using the original preferred `locales` specified by the user.
	return new IntlMessageFormat(message, locales)

	// "previous" and "next" formatters turned out to be unusable,
	// because "1 year ago" != "last year" (too vague for Jan 30th)
	// and "in 0.49 years" != "this year" (it could be Nov 30th).

	// // Add "previous unit" and "next unit" formatters (if any).
	// if (unit_formatting_rules.previous && unit_formatting_rules.next)
	// {
	// 	const previous_next_message = `{ when, select, past   {${unit_formatting_rules.previous}}
	// 	                                               future {${unit_formatting_rules.next}} }`
	//
	// 	// Create the synthetic IntlMessageFormat instance 
	// 	// using the original locales specified by the user
	// 	formatters.previous_next = new IntlMessageFormat(previous_next_message, this.locales)
	// }
}