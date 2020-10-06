var locale = require('relative-time-format/locale/de')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	// "tiny" is a legacy name of "mini".
	'long-time': require('../../locale-more-styles/de/long-time.json'),
	'mini-time': require('../../locale-more-styles/de/mini-time.json'),
	'tiny': require('../../locale-more-styles/de/mini-time.json'),
	'now': require('../../locale-more-styles/de/now.json'),
	// Quantifier.
	quantify: locale.quantify
}