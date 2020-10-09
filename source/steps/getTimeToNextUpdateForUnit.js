import { getSecondsInUnit } from './units'

/**
 * Gets the time to next update for a step with a time unit defined.
 * @param  {string} unit
 * @param  {(Date|number)} date — The date, as it was passed to `.format()`.
 * @param  {number} options.now
 * @param  {boolean} options.future
 * @return {number} [timeToNextUpdate]
 */
export default function getTimeToNextUpdateForUnit(unit, date, { now, future }) {
	// For some units, like "now", there's no defined amount of seconds in them.
	if (!getSecondsInUnit(unit)) {
		// If there's no amount of seconds defined for this unit
		// then the update interval can't be determined reliably.
		return
	}
	const timestamp = date.getTime ? date.getTime() : date
	const unitDenominator = getSecondsInUnit(unit) * 1000
	const preciseAmount = timestamp - now
	const roundedAmount = Math.round(preciseAmount / unitDenominator) * unitDenominator
	const timeToNextUpdate = 0.5 * unitDenominator - (future ? 1 : -1) * (preciseAmount - roundedAmount)
	if (timeToNextUpdate === 0) {
		return unitDenominator
	}
	return timeToNextUpdate
}