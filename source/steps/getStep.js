import getStepDenominator from './getStepDenominator'

/**
 * Finds an appropriate `step` of `steps` for the time interval (in seconds).
 *
 * @param {Object[]} steps - Time formatting steps.
 *
 * @param {number} secondsPassed - Time interval (in seconds).
 *                                 `< 0` for past dates and `> 0` for future dates.
 *
 * @param {number} options.now - Current timestamp.
 *
 * @param {boolean} [options.future] - Whether the date should be formatted as a future one
 *                                     instead of a past one.
 *
 * @param {string[]} [options.units] - A list of allowed time units.
 *                                     (Example: ['second', 'minute', 'hour', …])
 *
 * @param {boolean} [options.getNextStep] - Pass true to return `[step, nextStep]` instead of just `step`.
 *
 * @return {Object|Object[]} [step] — Either a `step` or `[step, nextStep]`.
 */
export default function getStep(steps, secondsPassed, { now, future, units, getNextStep }) {
	// Ignore steps having not-supported time units in `formatAs`.
	steps = filterStepsByUnits(steps, units)
	const step = _getStep(steps, secondsPassed, { now, future })
	if (getNextStep) {
		if (step) {
			const nextStep = steps[steps.indexOf(step) + 1]
			return [step, nextStep]
		}
		return []
	}
	return step
}

function _getStep(steps, secondsPassed, { now, future }) {
	// If no steps fit the conditions then return nothing.
	if (steps.length === 0) {
		return
	}

	// Find the most appropriate step.
	const i = getStepIndex(steps, secondsPassed, {
		now,
		future: future || secondsPassed < 0
	})

	// If no step is applicable the return nothing.
	if (i === -1) {
		return
	}

	const step = steps[i]

	// Apply granularity to the time amount
	// (and fall back to the previous step
	//  if the first level of granularity
	//  isn't met by this amount)
	if (step.granularity) {
		// Recalculate the amount of seconds passed based on `granularity`.
		const secondsPassedGranular = Math.round((Math.abs(secondsPassed) / getStepDenominator(step)) / step.granularity) * step.granularity
		// If the granularity for this step is too high,
		// then fall back to the previous step.
		// (if there is any previous step)
		if (secondsPassedGranular === 0 && i > 0) {
			return steps[i - 1]
		}
	}

	return step
}

/**
 * Returns the `minTime` threshold for moving from `fromStep` to `next_step`.
 * @param  {Object} fromStep - From step.
 * @param  {Object} toStep - To step.
 * @param  {number} options.now - Current timestamp.
 * @param  {number} options.secondsPassed - How much seconds have passed since the date till `now`.
 * @param  {boolean} options.future - Whether the time interval should be formatted as a future one.
 * @return {number}
 * @throws Will throw if no `minTime` threshold is found.
 */
function getThresholdForTransition(fromStep, toStep, secondsPassed, options) {
	let threshold
	let isLegacy

	// Allows custom thresholds when moving
	// from a specific step to a specific step.
	if (fromStep) {
		if (typeof toStep.minTime === 'object' && fromStep.id) {
			threshold = toStep.minTime[fromStep.id]
		}
		if (threshold === undefined) {
			// "threshold_for_idOrUnit: value" is a legacy way of specifying "minTime: { id: value }".
			// Developers should use "minTime" property instead of "threshold".
			if (fromStep.id || fromStep.unit) {
				threshold = toStep[`threshold_for_${fromStep.id || fromStep.unit}`]
				if (threshold !== undefined) {
					isLegacy = true
				}
			}
		}
	}

	// If no custom `minTime` threshold is defined for this "fromStep -> toStep" transition
	// then use the default `minTime` threshold for the next step.
	if (threshold === undefined) {
		// "threshold" is a legacy name of "minTime".
		if (toStep.threshold !== undefined) {
			threshold = toStep.threshold
			isLegacy = true
		} else {
			if (typeof toStep.minTime === 'object') {
				threshold = toStep.minTime.default
			} else {
				threshold = toStep.minTime
			}
		}
	}

	// Evaluate the `test()` function.
	if (threshold === undefined) {
		if (toStep.test) {
			const { now, future } = options
			if (toStep.test(now - secondsPassed * 1000, {
				now,
				future
			})) {
				// `0` threshold always passes.
				threshold = 0
			} else {
				// `MAX_SAFE_INTEGER` threshold won't ever pass in real life.
				threshold = 9007199254740991 // Number.MAX_SAFE_INTEGER
			}
		}
	}

	// Convert the threshold to a number.
	if (typeof threshold === 'function') {
		const { now, future } = options
		// if (isLegacy) {
			threshold = threshold(now, future)
		// } else {
		// 	threshold = threshold(secondsPassed, { now, future })
		// }
	}

	// Throw if no `minTime` threshold is found.
	if (fromStep && typeof threshold !== 'number') {
		// Babel transforms `typeof` into some "branches"
		// so istanbul will show this as "branch not covered".
		/* istanbul ignore next */
		const type = typeof threshold
		throw new Error(`[javascript-time-ago] Each step must define either \`minTime\` or \`test()\`, except for the first one. Got "${threshold}", ${type}. Step: ${JSON.stringify(toStep)}`)
	}

	return threshold
}

/**
 * Iterates through steps until it finds the maximum one satisfying the `minTime` threshold.
 * @param  {Object} steps - Steps.
 * @param  {number} secondsPassed - How much seconds have passed since the date till `now`.
 * @param  {number} options.now - Current timestamp.
 * @param  {boolean} options.future - Whether the time interval should be formatted as a future one.
 * @param  {number} [i] - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */
function getStepIndex(steps, secondsPassed, options, i = 0) {
	// If the `minTime` threshold for moving from previous step
	// to this step is too high then return the previous step.
	if (Math.abs(secondsPassed) < getThresholdForTransition(steps[i - 1], steps[i], secondsPassed, options)) {
		return i - 1
	}
	// If it's the last step then return it.
	if (i === steps.length - 1) {
		return i
	}
	// Move to the next step.
	return getStepIndex(steps, secondsPassed, options, i + 1)
}

/**
 * Leaves only allowed steps.
 * @param  {Object[]} steps
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */
function filterStepsByUnits(steps, units) {
	return steps.filter(({ unit, formatAs }) => {
		// "unit" is now called "formatAs".
		unit = unit || formatAs
		// If this step has a `unit` defined
		// then this `unit` must be in the list of allowed `units`.
		if (unit) {
			return units.indexOf(unit) >= 0
		}
		// A step is not required to specify a `unit`:
		// alternatively, it could specify `format()`.
		// (see "twitter" style for an example)
		return true
	})
}