var locale = require('relative-time-format/locale/en')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'short-time': require('../../locale-more-styles/en/short-time.json'),
	'short-convenient': require('../../locale-more-styles/en/short-convenient.json'),
	'long-time': require('../../locale-more-styles/en/long-time.json'),
	'long-convenient': require('../../locale-more-styles/en/long-convenient.json'),
	'tiny': require('../../locale-more-styles/en/tiny.json'),
	// Quantifier.
	quantify: locale.quantify
}