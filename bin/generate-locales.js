import plurals from 'make-plural'
import path from 'path'
import fs from 'fs-extra'

import parseCLDR from '../source/cldr'

throw new Error('Some locales (ru, en, ko) have their data changed. This script has been blocked because it was only used at the start for generating initial locale data for all locales. Since then that locale data may have been modified. To prevent that modified data from being accidentally overwritten this guard has been placed here.')

// Generate plurals first, then run this script.
//
// ```
// npm run generate-plurals
// npm run generate-locale-data
// npm run generate-load-all-locales
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

	// // Skip the already built-in languages.
	// if (language === 'en' || language === 'ru' || language === 'ko')
	// {
	// 	continue
	// }

	const cldrJsonPath = `cldr-dates-full/main/${language}/dateFields.json`
	const locale_folder = path.join(__dirname, '../locale', language)

	// If no such language exists in `cldr-dates-full`
	// then delete its folder along with the pluralization function.
	if (!fs.existsSync(path.resolve(__dirname, '../node_modules', cldrJsonPath)))
	{
		fs.removeSync(locale_folder)
		continue
	}

	// If there's no pluralization classifier function
	// for this language then don't add it.
	if (!fs.existsSync(path.join(locale_folder, 'quantify.js')))
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

	reduce_quantifiers(data.long)

	// Write the default "long" flavour (always present)
	fs.outputFileSync
	(
		path.join(locale_folder, 'long.json'),
		JSON.stringify(data.long, null, '\t')
	)

	// Write the "short" flavour (if present)
	if (data.short)
	{
		reduce_quantifiers(data.short)

		fs.outputFileSync
		(
			path.join(locale_folder, 'short.json'),
			JSON.stringify(data.short, null, '\t')
		)
	}

	// Write the "narrow" flavour (if present)
	//http://cldr.unicode.org/translation/plurals#TOC-Narrow-and-Short-Forms
	if (data.narrow)
	{
		reduce_quantifiers(data.narrow)

		fs.outputFileSync
		(
			path.join(locale_folder, 'narrow.json'),
			JSON.stringify(data.narrow, null, '\t')
		)
	}

	// `index.js`
	fs.outputFileSync
	(
		path.join(locale_folder, 'index.js'),
		`
module.exports =
{
	locale: '${language}',
	long: require('./long.json'),
	${data.short ? "short: require('./short.json')," : ""}
	${data.narrow ? "narrow: require('./narrow.json')," : ""}
	quantify: require('./quantify')
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
// ${data.narrow ? "export { default as narrow } from './narrow.json'": ""}
// export { default as quantify } from './quantify'
// 		`
// 		.trim()
// 	)
}

function reduce_quantifiers(flavour)
{
	for (const unit of Object.keys(flavour))
	{
		for (const past_future of Object.keys(flavour[unit]))
		{
			for (const quantifier of Object.keys(flavour[unit][past_future]))
			{
				if (quantifier === 'other')
				{
					continue
				}

				if (flavour[unit][past_future][quantifier] === flavour[unit][past_future].other)
				{
					delete flavour[unit][past_future][quantifier]
				}
			}
		}
	}
}