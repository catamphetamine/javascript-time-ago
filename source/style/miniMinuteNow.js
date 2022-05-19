import miniMinute from './miniMinute.js'

export default {
	...miniMinute,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(miniMinute.steps)
}