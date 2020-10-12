import { style } from './twitter'

let steps = style.steps.slice()

// Seconds.
// Format time in seconds starting from 0.5 seconds.
steps[0] = {
	...steps[0],
	minTime: 0.5
}

steps = [
	{
		formatAs: 'now'
	},
	...steps
]

export default {
	...style,
	steps
}