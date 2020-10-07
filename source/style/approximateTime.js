import approximate from '../steps/approximate'

// "gradation" is a legacy name for "steps".
// It's here just for legacy compatibility.
// Use "steps" name instead.

// "flavour" is a legacy name for "labels".
// It's here just for legacy compatibility.
// Use "labels" name instead.

// "units" is a legacy property.
// It's here just for legacy compatibility.
// Developers shouldn't need to use it in their custom styles.

// Similar to the default style but with "ago" omitted.
//
// just now
// 5 minutes
// 10 minutes
// 15 minutes
// 20 minutes
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
// a year
// 2 years
//
export default {
	gradation: approximate,
	flavour: 'long-time',
	units: [
		'now',
		'minute',
		'hour',
		'day',
		'week',
		'month',
		'year'
	]
}