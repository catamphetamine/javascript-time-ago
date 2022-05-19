import { minute, hour, day, week, month, year } from './units.js'

// "factor" is a legacy property.
// Developers shouldn't need to use it in their custom steps.

// "threshold" is a legacy name of "min".
// Developers should use "min" property name instead of "threshold".

// "threshold_for_idOrUnit: value" is a legacy way of specifying "min: { id: value }".
// Developers should use "min" property instead of "threshold".

// just now
// 1 minute ago
// 2 minutes ago
// 5 minutes ago
// 10 minutes ago
// 15 minutes ago
// 20 minutes ago
// …
// 50 minutes ago
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
// a year ago
// 2 years ago
// …
export default [
	{
		// This step returns the amount of seconds
		// by dividing the amount of seconds by `1`.
		factor: 1,
    	// "now" labels are used for formatting the output.
		unit: 'now'
	},
	{
		// When the language doesn't support `now` unit,
		// the first step is ignored, and it uses this `second` unit.
		threshold: 1,
		// `threshold_for_now` should be the same as `threshold` on minutes.
		threshold_for_now: 45.5,
		// This step returns the amount of seconds
		// by dividing the amount of seconds by `1`.
		factor: 1,
    	// "second" labels are used for formatting the output.
		unit: 'second'
	},
	{
		// `threshold` should be the same as `threshold_for_now` on seconds.
		threshold: 45.5,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in a minute.
		factor: minute,
    	// "minute" labels are used for formatting the output.
		unit: 'minute'
	},
	{
		// This step is effective starting from 2.5 minutes.
		threshold: 2.5 * minute,
		// Allow only 5-minute increments of minutes starting from 2.5 minutes.
		// `granularity` — (advanced) Time interval value "granularity".
		// For example, it could be set to `5` for minutes to allow only 5-minute increments
		// when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc.
		// Perhaps this feature will be removed because there seem to be no use cases
		// of it in the real world.
		granularity: 5,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in a minute.
		factor: minute,
		// "minute" labels are used for formatting the output.
		unit: 'minute'
	},
	{
		// This step is effective starting from 22.5 minutes.
		threshold: 22.5 * minute,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in  half-an-hour.
		factor: 0.5 * hour,
		// "half-hour" labels are used for formatting the output.
		// (if available, which is no longer the case)
		unit: 'half-hour'
	},
	{
		// This step is effective starting from 42.5 minutes.
		threshold: 42.5 * minute,
		threshold_for_minute: 52.5 * minute,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in an hour.
		factor: hour,
		// "hour" labels are used for formatting the output.
		unit: 'hour'
	},
	{
		// This step is effective starting from 20.5 hours.
		threshold: (20.5 / 24) * day,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in a day.
		factor: day,
		// "day" labels are used for formatting the output.
		unit: 'day'
	},
	{
		// This step is effective starting from 5.5 days.
		threshold: 5.5 * day,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in a week.
		factor: week,
		// "week" labels are used for formatting the output.
		unit: 'week'
	},
	{
		// This step is effective starting from 3.5 weeks.
		threshold: 3.5 * week,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in a month.
		factor: month,
		// "month" labels are used for formatting the output.
		unit: 'month'
	},
	{
		// This step is effective starting from 10.5 months.
		threshold: 10.5 * month,
		// Return the amount of minutes by dividing the amount
		// of seconds by the amount of seconds in a year.
		factor: year,
		// "year" labels are used for formatting the output.
		unit: 'year'
	}
]