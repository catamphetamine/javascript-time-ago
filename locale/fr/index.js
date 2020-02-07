var locale = require('relative-time-format/locale/fr')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'long-time': require('../../locale-more-styles/fr/long-time.json'),
	// Quantifier.
	quantify: locale.quantify
}