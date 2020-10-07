import {
	oneOfType,
	arrayOf,
	string,
	number,
	shape,
	func
} from 'prop-types'

const threshold = oneOfType([
	number,
	func
])

const steps = arrayOf(oneOfType([
	shape({
		unit: string.isRequired,
		// `factor` is a legacy property.
		factor: number,
		// `granularity` is a legacy property.
		granularity: number,
		threshold
		// Specific `threshold_[unit]` properties may also be defined.
	}),
	shape({
		format: func.isRequired,
		threshold
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
		custom: func
	})
])