// This function is only used for backwards compatibility
// with legacy code that uses the older versions of this library.
export default function(step_) {
	const step = { ...step_ }
	if (step.minTime !== undefined) {
		if (typeof step.minTime === 'object') {
			for (const key of Object.keys(step.minTime)) {
				if (key === 'default') {
					step.threshold = step.minTime.default
				} else {
					step[`threshold_for_${key}`] = step.minTime[key]
				}
			}
		} else {
			step.threshold = step.minTime
		}
		delete step.minTime
	}
	if (step.formatAs) {
		step.unit = step.formatAs
		delete step.formatAs
	}
	return step
}