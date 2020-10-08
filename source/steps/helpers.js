// Looks like this one's deprecated.
// /**
//  * Returns a step corresponding to the unit.
//  * @param  {Object[]} steps
//  * @param  {string} unit
//  * @return {?Object}
//  */
// export function getStepForUnit(steps, unit) {
// 	for (const step of steps) {
// 		if (step.unit === unit) {
// 			return step
// 		}
// 	}
// }

// Looks like this one won't be used in the next major version.
/**
 * Converts value to a `Date`
 * @param {(number|Date)} value
 * @return {Date}
 */
export function getDate(value) {
	return value instanceof Date ? value : new Date(value)
}