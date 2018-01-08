import plurals from 'make-plural'
import path from 'path'
import fs from 'fs-extra'

import parseCLDR from '../source/cldr'

// Generate plurals first, then run this script.
//
// ```
// npm run generate-plurals
// npm run generate-locale-data
// ````
for (const locale of Object.keys(plurals))
{
	// Some keys are locales, e.g. "pt-PT".
	// (whatever that means)
	const language = locale.split('-')[0]

	// Don't know what the "root" key is for so skip it.
	if (language === 'root')
	{
		continue
	}

	// Skip the already built-in languages.
	if (language === 'en' || language === 'ru')
	{
		continue
	}

	const cldrJsonPath = `cldr-dates-full/main/${language}/dateFields.json`
	const locale_folder = path.join(__dirname, '../locales', language)

	// If no such language exists in `cldr-dates-full`
	// then delete its folder along with the pluralization function.
	if (!fs.existsSync(path.resolve(__dirname, '../node_modules', cldrJsonPath)))
	{
		fs.removeSync(locale_folder)
		continue
	}

	// If there's no pluralization classifier function
	// for this language then don't add it.
	if (!fs.existsSync(path.join(locale_folder, 'plural.js')))
	{
		fs.removeSync(locale_folder)
		continue
	}

	let data = require(cldrJsonPath)

	data = parseCLDR(data)

	// There must be at least "long" flavour
	if (!data.long)
	{
		fs.removeSync(locale_folder)
		continue
	}

	// Write the default "long" flavour (always present)
	fs.outputFileSync
	(
		path.join(locale_folder, 'long.json'),
		JSON.stringify(data.long, null, '\t')
	)

	// Write the "short" flavour (if present)
	if (data.short)
	{
		fs.outputFileSync
		(
			path.join(locale_folder, 'short.json'),
			JSON.stringify(data.short, null, '\t')
		)
	}

	// `index.js`
	fs.outputFileSync
	(
		path.join(locale_folder, 'index.js'),
		`
var long = require('./long.json')
${data.short ? "var short = require('./short.json')" : ''}
var plural = require('./plural').default

module.exports =
{
	locale: '${language}',
	long: long,
	${data.short ? "short: short," : ""}
	plural: plural
}
		`
		.trim()
	)

// 	// `index.es6.js`
// 	// (though it's not used and has no purpose so far)
// 	fs.outputFileSync
// 	(
// 		path.join(locale_folder, 'index.es6.js'),
// 		`
// export var locale = '${language}'
// export { default as long } from './long.json'
// ${data.short ? "export { default as short } from './short.json'": ""}
// export { default as plural } from './plural'
// 		`
// 		.trim()
// 	)
}

// module.exports=exports["default"]