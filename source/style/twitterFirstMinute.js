import { style } from './twitter'

// Skip "seconds".
const steps = style.steps.slice(1)

// Starts showing `1m` after 40 seconds.
steps[0] = {
	...steps[0],
	minTime: 40
}

export default {
	...style,
	steps
}