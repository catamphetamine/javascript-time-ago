import { getSecondsInUnit } from './units.js'
import { getRoundFunction, getDiffRatioToNextRoundedNumber } from '../round.js'

/**
 * Gets the time to next update for a step with a time unit defined.
 * @param  {string} unit
 * @param  {number} date — The date passed to `.format()`, converted to a timestamp.
 * @param  {number} options.now
 * @param  {string} [options.round] — (undocumented) Rounding mechanism.
 * @return {number} [timeToNextUpdate]
 */
export default function getTimeToNextUpdateForUnit(unit, timestamp, { now, round }) {
	// For some units, like "now", there's no defined amount of seconds in them.
	if (!getSecondsInUnit(unit)) {
		// If there's no amount of seconds defined for this unit
		// then the update interval can't be determined reliably.
		return
	}
	const unitDenominator = getSecondsInUnit(unit) * 1000
	const future = timestamp > now
	const preciseAmount = Math.abs(timestamp - now)
	const roundedAmount = getRoundFunction(round)(preciseAmount / unitDenominator) * unitDenominator
	if (future) {
		if (roundedAmount > 0) {
			// Amount decreases with time.
			return (preciseAmount - roundedAmount) +
				getDiffToPreviousRoundedNumber(round, unitDenominator)
		} else {
			// Refresh right after the zero point,
			// when "future" changes to "past".
			return (preciseAmount - roundedAmount) + 1
		}
	}
 	// Amount increases with time.
	return -(preciseAmount - roundedAmount) + getDiffToNextRoundedNumber(round, unitDenominator)
}

function getDiffToNextRoundedNumber(round, unitDenominator) {
	return getDiffRatioToNextRoundedNumber(round) * unitDenominator
}

function getDiffToPreviousRoundedNumber(round, unitDenominator) {
	return (1 - getDiffRatioToNextRoundedNumber(round)) * unitDenominator + 1
}