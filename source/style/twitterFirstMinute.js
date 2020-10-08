import { style } from './twitter'

const steps = style.steps.slice(1)
steps[0] = {
	...steps[0],
	// Starts showing `1m` after 45.5 seconds.
	minTime: 45.5
}

export default {
	...style,
	steps
}