import { style } from './twitter'

// Skip seconds.
let steps = style.steps.slice(1)

// Minutes.
// Format time in minutes starting from 30 seconds.
steps[0] = {
	...steps[0],
	minTime: 30
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