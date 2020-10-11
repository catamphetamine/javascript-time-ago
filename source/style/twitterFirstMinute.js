import { style } from './twitter'

// Skip "seconds", "now", "seconds" (from `0.5`) steps.
const steps = style.steps.slice(3)
steps[0] = {
	...steps[0],
	// Starts showing `1m` after 45.5 seconds.
	minTime: 45.5
}

export default {
	...style,
	steps
}