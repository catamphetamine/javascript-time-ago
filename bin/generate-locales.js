import plurals from 'make-plural'
import path from 'path'
import fs from 'fs-extra'

import parseCLDR from '../source/cldr'

const stub_long = `{
	"year": {
		"previous": "last year",
		"current": "this year",
		"next": "next year",
		"past": "-{0} y",
		"future": "+{0} y"
	}`

// throw new Error('Some locales (ru, en, ko) have their data changed. This script has been blocked because it was only used at the start for generating initial locale data for all locales. Since then that locale data may have been modified. To prevent that modified data from being accidentally overwritten this guard has been placed here.')

// Generate plurals first, then run this script.
//
// ```
// npm run generate-plurals
// npm run generate-locale-data
// npm run generate-load-all-locales
// ````
const all_cldr_locales = list_all_cldr_locales()
for (const locale of all_cldr_locales) // .filter(_ => _.indexOf('cu') === 0))
{
	// Don't know what the "root" key is for so skip it.
	if (locale === 'root')
	{
		continue
	}

	// Temporary.
	if (locale.split('-')[0] === 'en' ||
		locale.split('-')[0] === 'ru' ||
		locale.split('-')[0] === 'ko')
	{
		continue
	}

	if
	(
		// For English language `en/short.json` and `en/narrow.json`
		// differ from one another by a simple dot, e.g. `yr.` vs `yr`.
		locale.indexOf('en-') === 0 ||
		// For PT language `pt/short.json` and `pt/narrow.json`
		// are different from all others which are identical to `pt-PT`.
		// Seems like a bug in CLDR.
		locale.indexOf('pt-') === 0
	)
	{
		fs.removeSync(path.join(__dirname, '../locale', locale))
		continue
	}

	console.log(locale)

	const language = locale.split('-')[0]
	const has_parent = language !== locale

	// // Skip the already built-in languages.
	// if (language === 'en' || language === 'ru' || language === 'ko')
	// {
	// 	continue
	// }

	// For PT language `pt/short.json` and `pt/narrow.json`
	// are different from all others which are identical to `pt-PT`.
	// Seems like a bug in CLDR.
	const cldr_locale = locale === 'pt' ? 'pt-PT' : locale

	const cldrJsonPath = `cldr-dates-full/main/${cldr_locale}/dateFields.json`
	const locale_folder = path.join(__dirname, '../locale', locale)
	const language_folder = path.join(__dirname, '../locale', language)

	// // If no such language exists in `cldr-dates-full`
	// // then delete its folder along with the pluralization function.
	// if (!fs.existsSync(path.resolve(__dirname, '../node_modules', cldrJsonPath)))
	// {
	// 	// fs.removeSync(locale_folder)
	// 	continue
	// }

	// If there's no pluralization classifier function
	// for this language then don't add it.
	const quantify = get_quantify_path(locale)

	let data = require(cldrJsonPath)

	data = parseCLDR(data)

	if (!data.long)
	{
		throw new Error(`Default (long) locale data is missing for locale "${locale}".`)
	}

	if (JSON.stringify(data.long, null, '\t').indexOf(stub_long) === 0)
	{
		console.warn(`Data for "${locale}" locale is an English stub. Skipping.`)
		fs.removeSync(locale_folder)
		continue
	}

	if (!data.short)
	{
		throw new Error(`Short locale data is missing for locale "${locale}".`)
	}

	if (!data.narrow)
	{
		throw new Error(`Narrow locale data is missing for locale "${locale}".`)
	}

	reduce_quantifiers(data.long)
	reduce_quantifiers(data.short)
	reduce_quantifiers(data.narrow)

	// http://cldr.unicode.org/translation/plurals#TOC-Narrow-and-Short-Forms

	// Extra flavours.
	const shortTimeExists = fs.existsSync(path.join(locale_folder, 'short-time.json'))
	const longTimeExists  = fs.existsSync(path.join(locale_folder, 'long-time.json'))
	const tinyExists      = fs.existsSync(path.join(locale_folder, 'tiny.json'))

	const parentShortTimeExists = fs.existsSync(path.join(language_folder, 'short-time.json'))
	const parentLongTimeExists  = fs.existsSync(path.join(language_folder, 'long-time.json'))
	const parentTinyExists      = fs.existsSync(path.join(language_folder, 'tiny.json'))

	// `index.js`
	fs.outputFileSync
	(
		path.join(locale_folder, 'index.js'),
		`
module.exports =
{
	${[
	"locale: '" + locale + "'",
	"long: require('" + generate_messages(locale, 'long', data) + "')",
	(longTimeExists || parentLongTimeExists) && "long_time: require('" + (longTimeExists ? '.' : '../' + language) + "/long-time.json')",
	"short: require('" + generate_messages(locale, 'short', data) + "')",
	(shortTimeExists || parentShortTimeExists) && "short_time: require('" + (shortTimeExists ? '.' : '../' + language) + "/short-time.json')",
	"narrow: require('" + generate_messages(locale, 'narrow', data) + "')",
	(tinyExists || parentTinyExists) && "tiny: require('" + (tinyExists ? '.' : '../' + language) + "/tiny.json')",
	quantify && ("quantify: require('" + quantify + "')")
]
.filter(_ => _)
.join(',\n\t')}
}
		`
		.trim()
	)

	// // Remove all non-CLDR-translated locales.
	// // (the ones having just a quantify function)
	// for (const locale of list_all_locales().filter(_ => all_cldr_locales.indexOf(_) < 0))
	// {
	// 	fs.removeSync(path.resolve(__dirname, '../locale', locale))
	// }

	// Remove all locales containing just `index.js`
	// which means they're fully inherting from parent locale.
	for (const locale of list_all_locales())
	{
		if (fs.readdirSync(path.join(__dirname, '../locale', locale)).length === 1)
		{
			fs.removeSync(path.resolve(__dirname, '../locale', locale))
		}
	}

	// Remove strange locales.
	fs.removeSync(path.resolve(__dirname, '../locale/en-001'))
	fs.removeSync(path.resolve(__dirname, '../locale/en-150'))
	fs.removeSync(path.resolve(__dirname, '../locale/en-US-POSIX'))
	fs.removeSync(path.resolve(__dirname, '../locale/es-419'))
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

function list_all_cldr_locales()
{
	return fs.readdirSync(path.join(__dirname, '../node_modules/cldr-dates-full/main/'))
		.filter(_ => fs.statSync(path.join(__dirname, '../node_modules/cldr-dates-full/main', _)).isDirectory())
}

function list_all_locales()
{
	return fs.readdirSync(path.join(__dirname, '../locale'))
		.filter(_ => fs.statSync(path.join(__dirname, '../locale', _)).isDirectory())
}

function generate_messages(locale, style, data)
{
	const content = JSON.stringify(data[style], null, '\t')

	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.

	const rest_parts = locale.split('-')
	const parts = []
	let inherit_from

	while (rest_parts.length > 0)
	{
		parts.push(rest_parts.shift())

		const parent_locale = parts.join('-')

		if (parent_locale === locale)
		{
			continue
		}

		if (!fs.existsSync(path.join(__dirname, '../locale', parent_locale)))
		{
			continue
		}

		if (!fs.existsSync(path.join(__dirname, '../locale', parent_locale, `${style}.json`)))
		{
			continue
		}

		const parent_content = fs.readFileSync(path.join(__dirname, '../locale', parent_locale, `${style}.json`), 'utf-8')

		if (parent_content === content)
		{
			inherit_from = parent_locale
		}
	}

	if (!inherit_from)
	{
		fs.outputFileSync(path.join(__dirname, '../locale', locale, `${style}.json`), content)
	}

	return inherit_from ? `../${inherit_from}/${style}.json` : `./${style}.json`
}

function get_quantify_path(locale)
{
	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.

	const rest_parts = locale.split('-')
	const parts = []
	let inherit_from

	while (rest_parts.length > 0)
	{
		parts.push(rest_parts.shift())

		const parent_locale = parts.join('-')

		if (parent_locale === locale)
		{
			continue
		}

		if (!fs.existsSync(path.join(__dirname, '../locale', parent_locale)))
		{
			continue
		}

		if (fs.existsSync(path.join(__dirname, '../locale', parent_locale, `quantify.js`)))
		{
			inherit_from = parent_locale
		}
	}

	if (!inherit_from)
	{
		if (!fs.existsSync(path.join(__dirname, '../locale', locale, `quantify.js`)))
		{
			return
		}
	}

	return inherit_from ? `../${inherit_from}/quantify` : `./quantify`
}