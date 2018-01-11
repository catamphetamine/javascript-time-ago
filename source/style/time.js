import { convenient } from '../gradation'

// Similar to the default style but with "ago" omitted.
//
// just now
// 5 minutes
// 10 minutes
// 15 minutes
// 20 minutes
// half an hour
// an hour
// 2 hours
// …
// 20 hours
// 1 day
// 2 days
// a week
// 2 weeks
// 3 weeks
// a month
// 2 months
// 3 months
// 4 months
// half a year
// a year
// 2 years
//
export default
{
	gradation: convenient,
	flavour: 'long_time',
	units:
	[
		'now',
		'minute',
		'half-hour',
		'hour',
		'day',
		'week',
		'month',
		'half-year',
		'year'
	]
}