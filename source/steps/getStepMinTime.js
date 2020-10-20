import { getSecondsInUnit } from './units'
import { getDiffRatioToNextRoundedNumber } from '../round'

export default function getStepMinTime(step, {
	prevStep,
	timestamp,
	// `now` argument is used in a deprecated `step.test()` function.
	now,
	future,
	round
}) {
	let minTime
	// "threshold_for_xxx" is a legacy property.
	if (prevStep) {
		if (prevStep.id || prevStep.unit) {
			minTime = step[`threshold_for_${prevStep.id || prevStep.unit}`]
		}
	}
	if (minTime === undefined) {
		// "threshold" is a legacy property.
		if (step.threshold !== undefined) {
			// "threshold" is a legacy name for "minTime".
			minTime = step.threshold
			// "threshold" function is deprecated.
			if (typeof minTime === 'function') {
				minTime = minTime(now, future)
			}
		}
	}
	if (minTime === undefined) {
		minTime = step.minTime
	}
	// A deprecated way of specifying a different threshold
	// depending on the previous step's unit.
	if (typeof minTime === 'object') {
		if (prevStep && prevStep.id && minTime[prevStep.id] !== undefined) {
			minTime = minTime[prevStep.id]
		} else {
			minTime = minTime.default
		}
	}
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
	// Evaluate the `test()` function.
	// `test()` function is deprecated.
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
	// Warn if no `minTime` was defined or could be deduced.
	if (minTime === undefined) {
		console.warn('[javascript-time-ago] A step should specify `minTime`:\n' + JSON.stringify(step, null, 2))
	}
	return minTime
}

function getMinTimeForUnit(toUnit, fromUnit, { round }) {
	const toUnitAmount = getSecondsInUnit(toUnit)
	// if (!fromUnit) {
	// 	return toUnitAmount;
	// }
	// if (!fromUnit) {
	// 	fromUnit = getPreviousUnitFor(toUnit)
	// }
	let fromUnitAmount
	if (fromUnit === 'now') {
		fromUnitAmount = getSecondsInUnit(toUnit)
	} else {
		fromUnitAmount = getSecondsInUnit(fromUnit)
	}
	if (toUnitAmount !== undefined && fromUnitAmount !== undefined) {
		return toUnitAmount - fromUnitAmount * (1 - getDiffRatioToNextRoundedNumber(round))
	}
}