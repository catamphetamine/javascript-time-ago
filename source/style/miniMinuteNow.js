import miniMinute from './miniMinute'

export default {
	...miniMinute,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(miniMinute.steps)
}