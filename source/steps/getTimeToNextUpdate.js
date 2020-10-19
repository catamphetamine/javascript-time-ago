import _getTimeToNextUpdateForUnit from './getTimeToNextUpdateForUnit'
import getStepMinTime from './getStepMinTime'
import { getRoundFunction } from '../round'

// A thousand years is practically a metaphor for "infinity".
const YEAR = 365 * 24 * 60 * 60 * 1000
export const INFINITY = 1000 * YEAR

/**
 * Gets the time to next update for a date and a step.
 * @param  {number} date — The date passed to `.format()`, converted to a timestamp.
 * @param  {object} step
 * @param  {object} [options.previousStep]
 * @param  {object} [options.nextStep]
 * @param  {number} options.now
 * @param  {boolean} options.future
 * @param  {string} [options.round] - (undocumented) Rounding mechanism.
 * @return {number} [timeToNextUpdate]
 */
export default function getTimeToNextUpdate(date, step, { prevStep, nextStep, now, future, round }) {
	const timestamp = date.getTime ? date.getTime() : date

	const getTimeToNextUpdateForUnit = (unit) => _getTimeToNextUpdateForUnit(unit, timestamp, { now, round })

	// For future dates, steps move from the last one to the first one,
	// while for past dates, steps move from the first one to the last one,
	// due to the fact that time flows in one direction,
	// and future dates' interval naturally becomes smaller
	// while past dates' interval naturally grows larger.
	//
	// For future dates, it's the transition
	// from the current step to the previous step,
	// therefore check the `minTime` of the current step.
	//
	// For past dates, it's the transition
	// from the current step to the next step,
	// therefore check the `minTime` of the next step.
	//
	const timeToStepChange = getTimeToStepChange(future ? step : nextStep, timestamp, {
		future,
		now,
		round,
		prevStep: future ? prevStep : step,
		// isFirstStep: future && isFirstStep
	})

	if (timeToStepChange === undefined) {
		// Can't reliably determine "time to next update"
		// if not all of the steps provide `minTime`.
		return
	}

	let timeToNextUpdate

	if (step) {
		if (step.getTimeToNextUpdate) {
			timeToNextUpdate = step.getTimeToNextUpdate(timestamp, {
				getTimeToNextUpdateForUnit,
				getRoundFunction,
				now,
				future,
				round
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
	}

	if (timeToNextUpdate === undefined) {
		return timeToStepChange
	}

	return Math.min(timeToNextUpdate, timeToStepChange)
}

export function getStepChangesAt(currentOrNextStep, timestamp, { now, future, round, prevStep }) {
	// The first step's `minTime` is `0` by default.
	// It doesn't "change" steps at zero point
	// but it does change the wording when switching
	// from "future" to "past": "in ..." -> "... ago".
	// Therefore, the label should be updated at zero-point too.
	const minTime = getStepMinTime(currentOrNextStep, { timestamp, now, future, round, prevStep })
	if (minTime === undefined) {
		return
	}
	if (future) {
		// The step changes to the previous step
		// as soon as `timestamp - now` becomes
		// less than the `minTime` of the current step:
		// `timestamp - now === minTime - 1`
		// => `now === timestamp - minTime + 1`.
		return timestamp - minTime * 1000 + 1
	} else {
		// The step changes to the next step
		// as soon as `now - timestamp` becomes
		// equal to `minTime` of the next step:
		// `now - timestamp === minTime`
		// => `now === timestamp + minTime`.

		// This is a special case when double-update could be skipped.
		if (minTime === 0 && timestamp === now) {
			return INFINITY
		}

		return timestamp + minTime * 1000
	}
}

export function getTimeToStepChange(step, timestamp, {
	now,
	future,
	round,
	prevStep
}) {
	if (step) {
		const stepChangesAt = getStepChangesAt(step, timestamp, {
			now,
			future,
			round,
			prevStep
		})
		if (stepChangesAt === undefined) {
			return
		}
		return stepChangesAt - now
	} else {
		if (future) {
			// No step.
			// Update right after zero point, when it changes from "future" to "past".
			return timestamp - now + 1
		} else {
			// The last step doesn't ever change when `date` is in the past.
			return INFINITY
		}
	}
}