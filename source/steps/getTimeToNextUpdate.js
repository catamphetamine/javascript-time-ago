import _getTimeToNextUpdateForUnit from './getTimeToNextUpdateForUnit'

/**
 * Gets the time to next update for a date and a step.
 * @param  {(Date|number)} date — The date, as it was passed to `.format()`.
 * @param  {object} step
 * @param  {object} [options.nextStep]
 * @param  {number} options.now
 * @param  {boolean} options.future
 * @return {number} [timeToNextUpdate]
 */
export default function getTimeToNextUpdate(dateOrTimestamp, step, { nextStep, now, future }) {
	const getTimeToNextUpdateForUnit = (unit) => _getTimeToNextUpdateForUnit(unit, dateOrTimestamp, { now, future })

	let nextStepMinTimestamp
	if (nextStep) {
		// "threshold" is a legacy name for "minTime".
		nextStepMinTimestamp = nextStep.threshold
		// "threshold" function is deprecated.
		if (typeof nextStepMinTimestamp === 'function') {
			nextStepMinTimestamp = nextStepMinTimestamp(now, future)
		}
		if (nextStepMinTimestamp === undefined) {
			// `minTime` is not a required property.
			// But when it's present, it can be used.
			if (nextStep.minTime) {
				nextStepMinTimestamp = nextStep.minTime
			}
		}
		// Convert seconds to milliseconds.
		if (nextStepMinTimestamp !== undefined) {
			nextStepMinTimestamp *= 1000
		}
	}

	let timeToNextUpdate

	if (step.getTimeToNextUpdate) {
		timeToNextUpdate = step.getTimeToNextUpdate(dateOrTimestamp, {
			getTimeToNextUpdateForUnit,
			now,
			future
		})
	}

	if (timeToNextUpdate === undefined) {
		// "unit" is now called "formatAs".
		const unit = step.unit || step.formatAs
		if (unit) {
			// For some units, like "now", there's no defined amount of seconds in them.
			// In such cases, `getTimeToNextUpdateForUnit()` returns `undefined`,
			// and the next step's `minTime` could be used to calculate the update interval:
			// it will just assume that the label never changes for this step.
			timeToNextUpdate = getTimeToNextUpdateForUnit(unit)
		}
	}

	if (timeToNextUpdate === undefined) {
		return nextStepMinTimestamp
	} else {
		if (nextStepMinTimestamp === undefined) {
			return timeToNextUpdate
		}
		return Math.min(timeToNextUpdate, nextStepMinTimestamp)
	}
}