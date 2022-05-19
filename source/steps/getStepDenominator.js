import { getSecondsInUnit } from './units.js'

export default function getStepDenominator(step) {
	// `factor` is a legacy property.
	if (step.factor !== undefined) {
		return step.factor
	}
	// "unit" is now called "formatAs".
	return getSecondsInUnit(step.unit || step.formatAs) || 1
}