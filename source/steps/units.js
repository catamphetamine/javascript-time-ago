export const minute = 60 // in seconds

export const hour = 60 * minute // in seconds

export const day = 24 * hour // in seconds

export const week = 7 * day // in seconds

// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const month = 30.44 * day // in seconds

// "400 years have 146097 days (taking into account leap year rules)"
export const year = (146097 / 400) * day // in seconds

export function getSecondsInUnit(unit) {
	switch (unit) {
		case 'second':
			return 1
		case 'minute':
			return minute
		case 'hour':
			return hour
		case 'day':
			return day
		case 'week':
			return week
		case 'month':
			return month
		case 'year':
			return year
	}
}

// export function getPreviousUnitFor(unit) {
// 	switch (unit) {
// 		case 'second':
// 			return 'now'
// 		case 'minute':
// 			return 'second'
// 		case 'hour':
// 			return 'minute'
// 		case 'day':
// 			return 'hour'
// 		case 'week':
// 			return 'day'
// 		case 'month':
// 			return 'week'
// 		case 'year':
// 			return 'month'
// 	}
// }