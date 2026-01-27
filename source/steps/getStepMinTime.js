import { getSecondsInUnit } from './units.js'
import { getDiffRatioToNextRoundedNumber } from '../round.js'

export default function getStepMinTime(step, {
	prevStep,
	timestamp,
	// `now` argument is used in a deprecated `step.test()` function.
	now,
	future,
	round
}) {
	let minTime

	// (deprecated)
	// Get `minTime` from "threshold_for_xxx" property of the `step`.
	// "threshold_for_xxx" property of a `step` is deprecated.
	if (prevStep) {
		if (prevStep.id || prevStep.unit) {
			minTime = step[`threshold_for_${prevStep.id || prevStep.unit}`]
		}
	}

	// (deprecated)
	// Get `minTime` from "threshold" property of the `step`.
	// "threshold" property of a `step` is deprecated.
	if (minTime === undefined) {
		if (step.threshold !== undefined) {
			// "threshold" is a legacy name for "minTime".
			minTime = step.threshold
			// "threshold" function is deprecated.
			if (typeof minTime === 'function') {
				minTime = minTime(now, future)
			}
		}
	}

	// Get `minTime` from `minTime` property of the `step`.
	// This is the only non-deprecated source for the `minTime` property.
	if (minTime === undefined) {
		minTime = step.minTime
	}

	// (deprecated)
	// If `minTime` is an object, calculate `minTime` from the previous step's `unit`.
	if (typeof minTime === 'object') {
		if (prevStep && prevStep.id && minTime[prevStep.id] !== undefined) {
			minTime = minTime[prevStep.id]
		} else {
			minTime = minTime.default
		}
	}

	// If `minTime` is a function, call it with certain arguments.
	if (typeof minTime === 'function') {
		minTime = minTime(timestamp, {
			future,
			getMinTimeForUnit(toUnit, fromUnit) {
				return getMinTimeForUnit(
					toUnit,
					fromUnit || prevStep && prevStep.formatAs,
					{ round }
				)
			}
		})
	}

	// (deprecated)
	// Get `minTime` from `step.test()` function property.
	// `step.test` property is deprecated.
	if (minTime === undefined) {
		if (step.test) {
			if (step.test(timestamp, {
				now,
				future
			})) {
				// `0` threshold always passes.
				minTime = 0
			} else {
				// `MAX_SAFE_INTEGER` threshold won't ever pass in real life.
				minTime = 9007199254740991 // Number.MAX_SAFE_INTEGER
			}
		}
	}

	// If `minTime` is `undefined`, calculate it from the previous `step`.
	// If it's the first step and there's no previous one, the `minTime` is assumed `0`.
	if (minTime === undefined) {
		if (prevStep) {
			if (step.formatAs && prevStep.formatAs) {
				minTime = getMinTimeForUnit(step.formatAs, prevStep.formatAs, { round })
			}
		} else {
			// The first step's `minTime` is `0` by default.
			minTime = 0
		}
	}

	// Warn if no `minTime` is defined for this step.
	if (minTime === undefined) {
		console.warn('[javascript-time-ago] A step should specify `minTime`:\n' + JSON.stringify(step, null, 2))
	}

	return minTime
}

function getMinTimeForUnit(toUnit, fromUnit, { round }) {
	const toUnitAmount = getSecondsInUnit(toUnit)
	const fromUnitAmount = fromUnit === 'now' ? getSecondsInUnit(toUnit) : getSecondsInUnit(fromUnit)
	if (toUnitAmount !== undefined && fromUnitAmount !== undefined) {
		return toUnitAmount - fromUnitAmount * (1 - getDiffRatioToNextRoundedNumber(round))
	}
}