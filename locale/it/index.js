var locale = require('relative-time-format/locale/it')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'long-time': require('../../locale-more-styles/it/long-time.json'),
	'now': require('../../locale-more-styles/it/now.json'),
	// Quantifier.
	quantify: locale.quantify
}