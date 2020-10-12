import { style } from './twitter'

let steps = style.steps.slice()

// Seconds.
// Format time in seconds after 0.5 seconds.
steps[0] = {
	...steps[0],
	minTime: 0.5
}

steps = [
	// Seconds
	{
		// If "now" labels are not available, will show "0s".
		formatAs: 'second'
	},
	// Now
	{
		// If "now" labels are available, will show "now".
		// At `0` seconds, Twitter shows "now".
		minTime: 0,
		formatAs: 'now'
	},
	...steps
]

export default {
	...style,
	steps
}