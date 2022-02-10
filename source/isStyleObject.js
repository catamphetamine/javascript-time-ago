export default function isStyleObject(object) {
	return isObject(object) && (
		Array.isArray(object.steps) ||
		// `gradation` property is deprecated: it has been renamed to `steps`.
		Array.isArray(object.gradation) ||
		// `flavour` property is deprecated: it has been renamed to `labels`.
		Array.isArray(object.flavour) ||
		typeof object.flavour === 'string' ||
		Array.isArray(object.labels) ||
		typeof object.labels === 'string' ||
		// `units` property is deprecated.
		Array.isArray(object.units) ||
		// `custom` property is deprecated.
		typeof object.custom === 'function'
	)
}

const OBJECT_CONSTRUCTOR = {}.constructor
function isObject(object) {
	return typeof object !== undefined && object !== null && object.constructor === OBJECT_CONSTRUCTOR
}