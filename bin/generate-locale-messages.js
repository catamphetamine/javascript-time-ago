import path from 'path'
import fs from 'fs-extra'

for (const locale of listAllRelativeTimeFormatLocales())
{
	const localeData = require('relative-time-format/locale/' + locale)

	const localeDirectory = path.join(__dirname, '../locale', locale)

	// Extra flavors.
	const EXTRA_STYLES = [
		'short-time',
		'short-convenient',
		'long-time',
		'long-convenient',
		'tiny'
	]

	const extraStyleDirectories = {}

	for (const style of EXTRA_STYLES) {
		const directory = findFlavorDirectory(locale, style)
		if (directory) {
			extraStyleDirectories[style] = directory
		}
	}

	// Create `index.js` file in the locale directory.
	fs.outputFileSync(
		path.join(localeDirectory, 'index.js'),
		`
var locale = require('relative-time-format/locale/${locale}')

module.exports = {
	${[
		'locale: locale.locale',
		'// Standard styles.',
		'long: locale.long',
		'short: locale.short',
		'narrow: locale.narrow',
		Object.keys(extraStyleDirectories).length > 0 && '// Additional styles.',
		...Object.keys(extraStyleDirectories).map(style => "'" + style + "': require('" + extraStyleDirectories[style] + "/" + style + ".json')"),
		localeData.quantify && "// Quantifier.",
		localeData.quantify && "quantify: locale.quantify",
	]
	.filter(_ => _)
	.join(',\n\t')
	.replace(/\.,\n/g, '.\n')}
}
		`.trim()
	)
}

/**
 * Returns a list of all locales supported by `relative-time-format`.
 * @return {string[]}
 */
export function listAllRelativeTimeFormatLocales() {
	return fs.readdirSync(path.join(__dirname, '../node_modules/relative-time-format/locale/'))
		.filter(_ => fs.statSync(path.join(__dirname, '../node_modules/relative-time-format/locale', _)).isDirectory())
}

/**
 * Returns the relative path to a directory where
 * a given "flavor" (short, long, narrow) labels file
 * resides for a given locale.
 * @param  {string} locale
 * @param  {string} flavor
 * @return {string} [directory]
 */
function findFlavorDirectory(locale, flavor) {
	if (fs.existsSync(path.join(__dirname, '../locale-more-styles', locale, `${flavor}.json`))) {
		return `../../locale-more-styles/${locale}`
	}
}

// /**
//  * "long-convenient" -> "longConvenient".
//  * @param  {string} string
//  * @return {string}
//  */
// function toCamelCase(string) {
// 	string = string.split('-').map(_ => _[0].toUpperCase() + _.slice(1)).join('')
// 	return string[0].toLowerCase() + string.slice(1)
// }