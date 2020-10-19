import { minute } from '../steps/units'
import twitter from './twitter'

export default {
	...twitter,
	// Skip "seconds".
	steps: twitter.steps.filter(step => step.formatAs !== 'second')
		// Start showing `1m` from the first minute.
		.map(step => step.formatAs === 'minute' ? { ...step, minTime: minute } : step)
}