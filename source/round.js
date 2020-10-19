export function getRoundFunction(round) {
	switch (round) {
		case 'floor':
			return Math.floor
		default:
			return Math.round
	}
}

// For non-negative numbers.
export function getDiffRatioToNextRoundedNumber(round) {
	switch (round) {
		case 'floor':
			// Math.floor(x) = x
			// Math.floor(x + 1) = x + 1
			return 1
		default:
			// Math.round(x) = x
			// Math.round(x + 0.5) = x + 1
			return 0.5
	}
}