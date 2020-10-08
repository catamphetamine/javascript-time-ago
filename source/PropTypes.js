import {
	oneOfType,
	arrayOf,
	objectOf,
	string,
	number,
	shape,
	func
} from 'prop-types'

const min = oneOfType([
	number,
	func
])

const steps = arrayOf(oneOfType([
	shape({
		min: oneOfType([objectOf(min), min]),
		// "threshold" has been renamed to "min".
		threshold: min,
		unit: string.isRequired,
		// `factor` is a legacy property.
		factor: number,
		// `granularity` is a legacy property.
		granularity: number,
		// Specific `threshold_for_[unit]` properties may also be defined.
	}),
	shape({
		min: oneOfType([objectOf(min), min]),
		// "threshold" has been renamed to "min".
		threshold: min,
		format: func.isRequired,
		// Specific `threshold_[unit]` properties may also be defined.
	})
]))

// Date/time formatting style.
export const style = oneOfType([
	string,
	shape({
		// "gradation" is a legacy name for "steps".
		gradation: steps,
		steps,
		units: arrayOf(string),
		labels: oneOfType([
			string,
			arrayOf(string)
		]),
		// "flavour" is a legacy name for "labels".
		flavour: oneOfType([
			string,
			arrayOf(string)
		]),
		// `custom` property seems deprecated.
		custom: func
	})
])