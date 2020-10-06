var locale = require('relative-time-format/locale/ru')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	// "tiny" is a legacy name of "mini".
	'short-time': require('../../locale-more-styles/ru/short-time.json'),
	'long-time': require('../../locale-more-styles/ru/long-time.json'),
	'mini-time': require('../../locale-more-styles/ru/mini-time.json'),
	'tiny': require('../../locale-more-styles/ru/mini-time.json'),
	'now': require('../../locale-more-styles/ru/now.json'),
	// Quantifier.
	quantify: locale.quantify
}