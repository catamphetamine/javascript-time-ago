import { day, month, year } from './helpers'

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
export default
[
	{
		unit: 'now',
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
]