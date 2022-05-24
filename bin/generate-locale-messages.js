import path from 'path'
import fs from 'fs-extra'

const localesDirectory = path.resolve('./locale')

const ADDITIONAL_STYLES = [
	// 'now' should come before 'mini' because `now.current`
	// is the default for `mini.now`.
	'now',
	'mini',
	'short-time',
	'long-time'
]

const ALL_LOCALES = getAllLocales()

for (const locale of ALL_LOCALES) {
	writeLocaleDataFile(locale)
	createLegacyCompatibilityLocaleFolder(locale)
}

addLocaleExports(ALL_LOCALES)

/**
 * Returns a list of all locales supported by `relative-time-format`.
 * @return {string[]}
 */
export function getAllLocales() {
	const LOCALE_FILE_NAME_REG_EXP = /([^\/]+)\.json$/
	return fs.readdirSync(path.join('./node_modules/relative-time-format/locale/'))
		.filter(_ => fs.statSync(path.join('./node_modules/relative-time-format/locale', _)).isFile() && LOCALE_FILE_NAME_REG_EXP.test(_))
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

function readJsonFromFile(path) {
	return JSON.parse(fs.readFileSync(path, 'utf8'))
}

function writeLocaleDataFile(locale) {
	// CLDR locale data: "long", "short", "narrow" labels.
	const baseLocaleData = readJsonFromFile('./node_modules/relative-time-format/locale/' + locale + '.json')

	const localeData = {
		...baseLocaleData,
		locale
	}

	for (const style of ADDITIONAL_STYLES) {
		const labelsFilePath = path.join('./locale-more-styles', locale, `${style}.json`)
		if (fs.existsSync(labelsFilePath)) {
			const labels = readJsonFromFile(labelsFilePath)
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

	// Create the locale `*.json` file.
	fs.outputFileSync(
		path.join(localesDirectory, `${locale}.json`),
		JSON.stringify(localeData, null, '\t')
	)

	// Create the locale `*.json.js` file.
	//
	// Stupid Node.js can't even `import` JSON files.
	// https://stackoverflow.com/questions/72348042/typeerror-err-unknown-file-extension-unknown-file-extension-json-for-node
	// Using a `*.json.js` duplicate file workaround.
	//
	fs.outputFileSync(
		path.join(localesDirectory, `${locale}.json.js`),
		'export default ' + JSON.stringify(localeData, null, '\t')
	)

	// Create the locale `*.json.d.ts` file.
	fs.outputFileSync(
		path.join(localesDirectory, `${locale}.json.d.ts`),
		`
import { LocaleData } from '../index';

declare const localeData: LocaleData;
export default localeData;
		`.trim()
	)
}

// (deprecated)
// Creates a legacy-compatibility locale directory export.
function createLegacyCompatibilityLocaleFolder(locale) {
	const localeDirectory = path.join(localesDirectory, locale)

// 	// Create a legacy-compatibility `index.js` file.
// 	fs.outputFileSync(
// 		path.join(localeDirectory, 'index.js'),
// 		`
// export { default } from '../${locale}.json.js'
// 		`.trim()
// 	)

// 	// Create a legacy-compatibility `index.cjs` file.
// 	fs.outputFileSync(
// 		path.join(localeDirectory, 'index.cjs'),
// 		`
// var localeData = require('../${locale}.json')
// exports = module.exports = localeData
// exports['default'] = localeData
// 		`.trim()
// 	)

// 	// Create a legacy-compatibility `index.cjs.js` file.
// 	// It's the same as `index.cjs`, just with an added `.js` file extension.
// 	// It only exists for compatibility with the software that doesn't like `*.cjs` file extension.
// 	// https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/61#note_950728292
// 	fs.outputFileSync(
// 		path.join(localeDirectory, 'index.cjs.js'),
// 		`
// var localeData = require('../${locale}.json')
// exports = module.exports = localeData
// exports['default'] = localeData
// 		`.trim()
// 	)

	// Create `package.json` for the legacy-compatibility locale directory.
	fs.outputFileSync(
		path.join(localeDirectory, 'package.json'),
		JSON.stringify({
			private: true,
			name: `javascript-time-ago/locale/${locale}`,
			main: `../${locale}.json`,
			module: `../${locale}.json.js`,
			types: `../${locale}.json.d.ts`,
			type: 'module',
			exports: {
				'.': {
					types: `../${locale}.json.d.ts`,
					import: `../${locale}.json.js`,
					require: `../${locale}.json`
				}
			},
			sideEffects: false
		}, null, '\t')
	)
}

// Add `export` entries in `package.json`.
function addLocaleExports(ALL_LOCALES) {
	// Read `package.json` file.
	const packageJson = readJsonFromFile('./package.json')

	// Remove all locale exports.
	for (const path of Object.keys(packageJson.exports)) {
		if (path.startsWith('./locale/')) {
			delete packageJson.exports[path]
		}
	}

	// Re-add all locale exports.
	packageJson.exports = {
		...packageJson.exports,
		...ALL_LOCALES.reduce((all, locale) => {
			all[`./locale/${locale}`] = {
				import: `./locale/${locale}.json.js`,
				require: `./locale/${locale}.json`
			}
			all[`./locale/${locale}.json`] = {
				import: `./locale/${locale}.json.js`,
				require: `./locale/${locale}.json`
			}
			return all
		}, {})
	}

	// Save `package.json` file.
	fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
}