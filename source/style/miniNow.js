import mini from './mini'

export default {
	...mini,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(mini.steps)
}