import { day, month, year } from './helpers'

// just now
// 1 minute ago
// 2 minutes ago
// 5 minutes ago
// 10 minutes ago
// 15 minutes ago
// 20 minutes ago
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
export default
[
	{
		factor: 1,
		unit: 'now'
	},
	{
		threshold: 1,
		threshold_for_now: 45,
		factor: 1,
		unit: 'second'
	},
	{
		threshold: 45,
		factor: 60,
		unit: 'minute'
	},
	{
		threshold: 2.5 * 60,
		factor: 60,
		granularity: 5,
		unit: 'minute'
	},
	{
		threshold: 22.5 * 60,
		factor: 30 * 60,
		unit: 'half-hour'
	},
	{
		threshold: 42.5 * 60,
		threshold_for_minute: 52.5 * 60,
		factor: 60 * 60,
		unit: 'hour'
	},
	{
		threshold: (20.5 / 24) * day,
		factor: day,
		unit: 'day'
	},
	{
		threshold: 5.5 * day,
		factor: 7 * day,
		unit: 'week'
	},
	{
		threshold: 3.5 * 7 * day,
		factor: month,
		unit: 'month'
	},
	{
		threshold: 10.5 * month,
		factor: year,
		unit: 'year'
	}
]