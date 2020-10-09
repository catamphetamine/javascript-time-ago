import path from 'path'
import fs from 'fs-extra'

const localesDirectory = path.join(__dirname, '../locale')

for (const locale of listAllRelativeTimeFormatLocales()) {
	const localeData = require('relative-time-format/locale/' + locale)

	// Extra flavors.
	const EXTRA_STYLES = [
		'short-time',
		'long-time',
		'mini-time',
		'now'
	]

	const extraStyleDirectories = {}

	for (const style of EXTRA_STYLES) {
		const directory = findLabelsStyleDirectory(locale, style)
		if (directory) {
			extraStyleDirectories[style] = directory
			if (style === 'mini-time') {
				// "tiny" is a legacy name of "mini-time".
				extraStyleDirectories['tiny'] = directory
			}
		}
	}

	const extendedLocaleData = {
		...localeData,
		locale
	}

	for (const style of Object.keys(extraStyleDirectories)) {
		extendedLocaleData[style] = require(extraStyleDirectories[style]  + '/' + (style === 'tiny' ? 'mini-time' : style) + '.json')
	}

	// Create the locale *.json file.
	fs.outputFileSync(
		path.join(localesDirectory, `${locale}.json`),
		JSON.stringify(extendedLocaleData, null, '\t')
	)

	// Create the legacy-compatibility `index.js` file.
	const localeDirectory = path.join(localesDirectory, locale)
	fs.outputFileSync(
		path.join(localeDirectory, 'index.js'),
		`module.exports = require('../${locale}.json')`
	)
}


/**
 * Returns a list of all locales supported by `relative-time-format`.
 * @return {string[]}
 */
export function listAllRelativeTimeFormatLocales() {
	const LOCALE_FILE_NAME_REG_EXP = /([^\/]+)\.json$/
	return fs.readdirSync(path.join(__dirname, '../node_modules/relative-time-format/locale/'))
		.filter(_ => fs.statSync(path.join(__dirname, '../node_modules/relative-time-format/locale', _)).isFile() && LOCALE_FILE_NAME_REG_EXP.test(_))
		.map(_ => _.match(LOCALE_FILE_NAME_REG_EXP)[1])
}

/**
 * Returns the relative path to a directory where
 * a given labels "style" (short, long, narrow) labels file
 * resides for a given locale.
 * @param  {string} locale
 * @param  {string} labelsStyle
 * @return {string} [directory]
 */
function findLabelsStyleDirectory(locale, labelsStyle) {
	if (fs.existsSync(path.join(__dirname, '../locale-more-styles', locale, `${labelsStyle}.json`))) {
		return `../locale-more-styles/${locale}`
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