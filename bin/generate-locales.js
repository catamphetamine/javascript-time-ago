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

// Generate plurals first, then run this script.
//
// ```
// npm run generate-plurals
// npm run generate-locale-data
// npm run generate-load-all-locales
// ````
const all_cldr_locales = list_all_cldr_locales()
for (const locale of all_cldr_locales) // .filter(_ => _.indexOf('ru') === 0))
{
	// Don't know what the "root" key is for so skip it.
	if (locale === 'root')
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
	const quantifyFolder = get_quantify_folder(locale)

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
	const shortTimeFolder       = get_flavour_folder(locale, 'short-time')
	const shortConvenientFolder = get_flavour_folder(locale, 'short-convenient')
	const longTimeFolder        = get_flavour_folder(locale, 'long-time')
	const longConvenientFolder  = get_flavour_folder(locale, 'long-convenient')
	const tinyFolder            = get_flavour_folder(locale, 'tiny')

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
	longTimeFolder && "long_time: require('" + longTimeFolder + "/long-time.json')",
	longConvenientFolder && "long_convenient: require('" + longConvenientFolder + "/long-convenient.json')",
	"short: require('" + generate_messages(locale, 'short', data) + "')",
	shortTimeFolder && "short_time: require('" + shortTimeFolder + "/short-time.json')",
	shortConvenientFolder && "short_convenient: require('" + shortConvenientFolder + "/short-convenient.json')",
	"narrow: require('" + generate_messages(locale, 'narrow', data) + "')",
	tinyFolder && "tiny: require('" + tinyFolder + "/tiny.json')",
	quantifyFolder && ("quantify: require('" + quantifyFolder + "/quantify')")
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
		const files = fs.readdirSync(path.join(__dirname, '../locale', locale))

		if (files.length === 1 && files[0] === 'index.js')
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
	const inherit_from = get_inherit_from(locale, `${style}.json`,
	{
		condition: (file) => fs.readFileSync(file, 'utf-8') === content
	})

	if (inherit_from)
	{
		return `../${inherit_from}/${style}.json`
	}

	fs.outputFileSync(path.join(__dirname, '../locale', locale, `${style}.json`), content)
	return `./${style}.json`
}

function get_quantify_folder(locale)
{
	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
	const inherit_from = get_inherit_from(locale, 'quantify.js')

	if (inherit_from)
	{
		return `../${inherit_from}`
	}

	if (fs.existsSync(path.join(__dirname, '../locale', locale, 'quantify.js')))
	{
		return `.`
	}
}

function get_flavour_folder(locale, flavour)
{
	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
	const inherit_from = get_inherit_from(locale, `${flavour}.json`, { self: true })
	if (inherit_from === locale)
	{
		return '.'
	}
	return inherit_from && `../${inherit_from}`
}

function get_inherit_from(locale, file, options = {})
{
	const rest_parts = locale.split('-')
	const parts = []
	let inherit_from

	while (rest_parts.length > 0)
	{
		parts.push(rest_parts.shift())

		const parent_locale = parts.join('-')

		if (!options.self && parent_locale === locale)
		{
			continue
		}

		if (!fs.existsSync(path.join(__dirname, '../locale', parent_locale)))
		{
			continue
		}

		if (fs.existsSync(path.join(__dirname, '../locale', parent_locale, file)))
		{
			if (!options.condition || options.condition(path.join(__dirname, '../locale', parent_locale, file)))
			{
				inherit_from = parent_locale
			}
		}
	}

	return inherit_from
}