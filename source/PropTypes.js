import
{
	oneOfType,
	arrayOf,
	string,
	number,
	shape,
	func
}
from 'prop-types'

const threshold = oneOfType
([
	number,
	func
])

const gradation = arrayOf(oneOfType(
[
	shape
	({
		name        : string.isRequired,
		factor      : number,
		granularity : number,
		threshold
		// Specific `threshold_[unit]` properties may also be defined
	}),
	shape
	({
		format : func.isRequired,
		threshold
		// Specific `threshold_[unit]` properties may also be defined
	})
]))

// Date/time formatting style.
// E.g. 'twitter', 'fuzzy', or custom (`{ gradation: […], units: […], flavour: 'long', custom: function }`)
const style = oneOfType
([
	string,
	shape
	({
		gradation,
		units   : arrayOf(string),
		flavour : oneOfType
		([
			string,
			arrayOf(string)
		]),
		custom : func
	})
])

export default
{
	style
}