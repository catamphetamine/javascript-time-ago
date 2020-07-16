var locale = require('relative-time-format/locale/de')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'long-time': require('../../locale-more-styles/de/long-time.json'),
	'long-convenient': require('../../locale-more-styles/de/long-convenient.json'),
	'tiny': require('../../locale-more-styles/de/tiny.json'),
	// Quantifier.
	quantify: locale.quantify
}