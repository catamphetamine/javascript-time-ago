export const day = 24 * 60 * 60 // in seconds

// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const month = 30.44 * day

// "400 years have 146097 days (taking into account leap year rules)"
export const year = (146097 / 400) * day

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
// * unit - (required) The name of the time interval measurement unit.
//
// * factor - (required) The amount of seconds will be divided by this number for this unit.
//
// * granularity - A step for the unit's resulting "amount" value.
//
// * threshold - Min value (in seconds) for this unit. Is required for non-first unit.
//
// * threshold_for_[unit] - A specific threshold required for moving from `[unit]` to this unit.
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
			factor: day,
			threshold: 23.5 * 60 * 60
		},
		{
			unit: 'week',
			factor: 7 * day,
			threshold: 6.5 * day
		},
		{
			unit: 'month',
			factor: month,
			threshold: 3.5 * 7 * day
		},
		{
			unit: 'year',
			factor: year,
			threshold: 11.5 * month
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
			factor: day,
			threshold: (20.5 / 24) * day
		},
		{
			unit: 'week',
			factor: 7 * day,
			threshold: 5.5 * day
		},
		{
			unit: 'month',
			factor: month,
			threshold: 3.5 * 7 * day
		},
		{
			unit: 'half-year',
			factor: 0.5 * year,
			threshold: 4.5 * month
		},
		{
			unit: 'year',
			factor: year,
			threshold: 9 * month,
			threshold_for_month: 10.5 * month
		}
	]
}