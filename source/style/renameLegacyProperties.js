import renameLegacyProperties from '../steps/renameLegacyProperties.js'

// This function is only used for backwards compatibility
// with legacy code that uses the older versions of this library.
export default function(style_) {
	const style = { ...style_ }
	if (style.steps) {
		style.gradation = style.steps.map(renameLegacyProperties)
		delete style.steps
	}
	if (style.labels) {
		style.flavour = style.labels
		delete style.labels
	}
	return style
}