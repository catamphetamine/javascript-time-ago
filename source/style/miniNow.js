import mini from './mini.js'

export default {
	...mini,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(mini.steps)
}