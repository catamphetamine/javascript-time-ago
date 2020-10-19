import path from 'path'
import fs from 'fs-extra'

const localesDirectory = path.join(__dirname, '../locale')

const ADDITIONAL_STYLES = [
	// 'now' should come before 'mini' because `now.current`
	// is the default for `mini.now`.
	'now',
	'mini',
	'short-time',
	'long-time'
]

for (const locale of getAllLocales()) {
	// CLDR locale data: "long", "short", "narrow" labels.
	const baseLocaleData = require('relative-time-format/locale/' + locale)

	const localeData = {
		...baseLocaleData,
		locale
	}

	for (const style of ADDITIONAL_STYLES) {
		const labelsFilePath = path.join(__dirname, '../locale-more-styles', locale, `${style}.json`)
		if (fs.existsSync(labelsFilePath)) {
			const labels = require(labelsFilePath)
			localeData[style] = labels
			if (style === 'mini') {
				if (!labels.now) {
					const nowLabel = getNowLabel(localeData)
					if (nowLabel) {
						labels.now = nowLabel
					}
				}
			}
		}
	}

	// Locales are guaranteed to have a "now" label.
	if (!getNowLabel(localeData)) {
		throw new Error(`"now" label not found for locale "${locale}"`)
	}

	// Create the locale *.json file.
	fs.outputFileSync(
		path.join(localesDirectory, `${locale}.json`),
		JSON.stringify(localeData, null, '\t')
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
export function getAllLocales() {
	const LOCALE_FILE_NAME_REG_EXP = /([^\/]+)\.json$/
	return fs.readdirSync(path.join(__dirname, '../node_modules/relative-time-format/locale/'))
		.filter(_ => fs.statSync(path.join(__dirname, '../node_modules/relative-time-format/locale', _)).isFile() && LOCALE_FILE_NAME_REG_EXP.test(_))
		.map(_ => _.match(LOCALE_FILE_NAME_REG_EXP)[1])
}

function getNowLabel(localeData) {
	if (localeData.now) {
		if (localeData.now.now.current) {
			return localeData.now.now.current
		}
	}
	return localeData.long.second.current
}