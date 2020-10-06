var locale = require('relative-time-format/locale/el')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	// "tiny" is a legacy name of "mini".
	'mini-time': require('../../locale-more-styles/el/mini-time.json'),
	'tiny': require('../../locale-more-styles/el/mini-time.json'),
	// Quantifier.
	quantify: locale.quantify
}