import twitter from './twitter.js'

export default {
	...twitter,
	// Skip "seconds".
	steps: twitter.steps.filter(step => step.formatAs !== 'second')
}