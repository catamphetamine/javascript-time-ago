// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const days_in_a_month = 30.44

// "400 years have 146097 days (taking into account leap year rules)"
export const days_in_a_year = 146097 / 400

export const a_day = 24 * 60 * 60 // in seconds

// A gradation is a mapping from a time interval (in seconds)
// to the most appropriate time interval measurement unit
// for describing it, along with the amount of such units.
//
// E.g. for "canonical" gradation:
//
// 0 -> 1 'just-now'
// 0.5 -> 1 'second'
// 60 -> 1 'minute'
// 91 -> 2 'minute's
// ...
//
// Each gradation unit can have:
//
// * unit - (required) the name of the time interval measurement unit.
//
// * factor - (required) the amount of seconds will be divided by this number for this unit.
//
// * granularity - a step for the unit's resulting "amount" value.
//
// * threshold - min value (in seconds) for this unit.
//
// * threshold_for_[unit] - a specific threshold required for moving from `[unit]` to this unit.
//                          E.g. if "just-now" unit is present in time units gradation
//                          then `threshold_for_just-now` can be set to `45` seconds.
//                          Otherwise, if "just-now" unit is omitted from time units gradation,
//                          then `elapsed(0)` will output "0 seconds" because there's no `threshold`.
//
// A user can supply his own gradation.
//
export default
{
	// just now
	// 1 second ago
	// …
	// 59 seconds ago
	// 1 minute ago
	// …
	// 59 minutes ago
	// 1 hour ago
	// …
	// 24 hours ago
	// 1 day ago
	// …
	// 7 days ago
	// 1 week ago
	// …
	// 3 weeks ago
	// 1 month ago
	// …
	// 11 months ago
	// 1 year ago
	// …
	canonical: () => [
		{
			unit: 'just-now',
			factor: 1
		},
		{
			unit: 'second',
			factor: 1,
			threshold: 0.5
		},
		{
			unit: 'minute',
			factor: 60,
			threshold: 59.5
		},
		{
			unit: 'hour',
			factor: 60 * 60,
			threshold: 59.5 * 60
		},
		{
			unit: 'day',
			factor: a_day,
			threshold: 23.5 * 60 * 60
		},
		{
			unit: 'week',
			factor: 7 * a_day,
			threshold: 6.5 * a_day
		},
		{
			unit: 'month',
			factor: days_in_a_month * a_day,
			threshold: 3.5 * 7 * a_day * a_day
		},
		{
			unit: 'year',
			factor: days_in_a_year * a_day,
			threshold: 11.5 * days_in_a_month * a_day
		}
	],

	// just now
	// 1 minute ago
	// 2 minutes ago
	// 5 minutes ago
	// 10 minutes ago
	// 15 minutes ago
	// 20 minutes ago
	// half an hour ago
	// an hour ago
	// 2 hours ago
	// …
	// 20 hours ago
	// a day ago
	// 2 days ago
	// 5 days ago
	// a week ago
	// 2 weeks ago
	// 3 weeks ago
	// a month ago
	// 2 months ago
	// 4 months ago
	// half a year ago
	// a year ago
	// 2 years ago
	// …
	convenient: () => [
		{
			unit: 'just-now',
			factor: 1
		},
		{
			unit: 'second',
			factor: 1,
			threshold: 1,
			'threshold_for_just-now': 45
		},
		{
			unit: 'minute',
			factor: 60,
			threshold: 45
		},
		{
			unit: 'minute',
			factor: 60,
			threshold: 2.5 * 60,
			granularity: 5
		},
		{
			unit: 'half-hour',
			factor: 30 * 60,
			threshold: 22.5 * 60
		},
		{
			unit: 'hour',
			factor: 60 * 60,
			threshold: 42.5 * 60,
			threshold_for_minute: 52.5 * 60
		},
		{
			unit: 'day',
			factor: a_day,
			threshold: (20.5 / 24) * a_day
		},
		{
			unit: 'week',
			factor: 7 * a_day,
			threshold: 5.5 * a_day
		},
		{
			unit: 'month',
			factor: days_in_a_month * a_day,
			threshold: 3.5 * 7 * a_day
		},
		{
			unit: 'half-year',
			factor: 0.5 * days_in_a_year * a_day,
			threshold: 4.5 * days_in_a_month * a_day
		},
		{
			unit: 'year',
			factor: days_in_a_year * a_day,
			threshold: 9 * days_in_a_month * a_day,
			threshold_for_month: 10.5 * days_in_a_month * a_day
		}
	]
}