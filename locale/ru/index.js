var locale = require('relative-time-format/locale/ru')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'short-time': require('../../locale-more-styles/ru/short-time.json'),
	'short-convenient': require('../../locale-more-styles/ru/short-convenient.json'),
	'long-time': require('../../locale-more-styles/ru/long-time.json'),
	'long-convenient': require('../../locale-more-styles/ru/long-convenient.json'),
	'tiny': require('../../locale-more-styles/ru/tiny.json'),
	// Quantifier.
	quantify: locale.quantify
}