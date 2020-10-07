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

export default {
	gradation: approximate,
	flavour: 'long',
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