import { style } from './twitter'

// Skip seconds.
const steps = style.steps.slice(1)

// Remove `minTime` from minutes.
steps[0] = {
	...steps[0],
	minTime: undefined
}

export default {
	...style,
	steps
}