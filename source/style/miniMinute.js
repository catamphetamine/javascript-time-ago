import mini from './mini.js'

export default {
	...mini,
	// Skip "seconds".
	steps: mini.steps.filter(step => step.formatAs !== 'second')
}