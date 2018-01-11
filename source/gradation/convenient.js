import { day, month, year } from './helpers'

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
export default
[
	{
		unit: 'now',
		factor: 1
	},
	{
		unit: 'second',
		factor: 1,
		threshold: 1,
		threshold_for_now: 45
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