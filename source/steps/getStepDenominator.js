import { minute, hour, day, week, month, year } from './units'

export default function getStepDenominator(step) {
	// `factor` is a legacy property.
	if (step.factor !== undefined) {
		return step.factor
	}
	// "unit" is now called "formatAs".
	switch (step.unit || step.formatAs) {
		// case 'now':
		// 	return 1
		case 'second':
			return 1
		case 'minute':
			return minute
		case 'hour':
			return hour
		case 'day':
			return day
		case 'week':
			return week
		case 'month':
			return month
		case 'year':
			return year
	}
	return 1
}