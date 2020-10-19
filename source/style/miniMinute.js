import mini from './mini'

export default {
	...mini,
	// Skip "seconds".
	steps: mini.steps.filter(step => step.formatAs !== 'second')
}