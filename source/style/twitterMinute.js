import twitter from './twitter'

export default {
	...twitter,
	// Skip "seconds".
	steps: twitter.steps.filter(step => step.formatAs !== 'second')
}