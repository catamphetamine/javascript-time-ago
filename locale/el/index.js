var locale = require('relative-time-format/locale/el')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'tiny': require('../../locale-more-styles/el/tiny.json'),
	// Quantifier.
	quantify: locale.quantify
}