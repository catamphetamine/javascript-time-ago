import { minute, hour, day, week, month, year } from './units'

// just now
// 1 second ago
// 2 seconds ago
// …
// 59 seconds ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 hour ago
// 2 hours ago
// …
// 24 hours ago
// 1 day ago
// 2 days ago
// …
// 6 days ago
// 1 week ago
// 2 weeks ago
// …
// 3 weeks ago
// 1 month ago
// 2 months ago
// …
// 11 months ago
// 1 year ago
// 2 years ago
// …
export default [
	{
		unit: 'now'
	},
	{
		// If "now" units aren't available or allowed,
		// then it'll simply output an empty string for
		// time intervals under 0.5 seconds.
		threshold: 0.5,
		unit: 'second'
	},
	{
		threshold: 59.5,
		unit: 'minute'
	},
	{
		threshold: 59.5 * minute,
		unit: 'hour'
	},
	{
		threshold: 23.5 * hour,
		unit: 'day'
	},
	{
		threshold: 6.5 * day,
		unit: 'week'
	},
	{
		// In case "week" units aren't available or allowed.
		threshold: 29.5 * day,
		// In case "week" units are available and allowed.
		threshold_for_week: 3.5 * week,
		unit: 'month'
	},
	{
		threshold: 11.5 * month,
		unit: 'year'
	}
]