// "convenient" is a legacy name of "approximate" steps.
export { default as approximate, default as convenient } from './approximate'

// "canonical" is a legacy name of "round" steps.
export { default as round, default as canonical } from './round'

export {
	minute,
	hour,
	day,
	week,
	month,
	year
} from './units'

export {
	getStepForUnit,
	// `getStep` is a legacy name for `getStepForUnit`.
	getStepForUnit as getStep,
	getDate
} from './helpers'