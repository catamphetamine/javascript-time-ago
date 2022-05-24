import path from 'path'
import fs from 'fs'

const locales = []

fs.readdirSync(path.resolve('./locale')).forEach((locale) => {
	const localePath = path.resolve('./locale', locale)
	if (fs.statSync(localePath).isDirectory()) {
		if (fs.existsSync(path.resolve('./locale', locale, 'package.json'))) {
			locales.push(locale)
		}
	}
})

// Write `index.js` file.
fs.writeFileSync(path.resolve('./load-all-locales/index.js'),
`
import TimeAgo from "javascript-time-ago"

${locales.map(locale => 'import ' + getLocaleVariableName(locale) + ' from "javascript-time-ago/locale/' + locale + '.json"').join('\n')}

${locales.map(locale => 'TimeAgo.addLocale(' + getLocaleVariableName(locale) + ')').join('\n')}
`
.trim())

// Write `index.cjs` file.
fs.writeFileSync(path.resolve('./load-all-locales/index.cjs'),
`
var TimeAgo = require("javascript-time-ago")
${locales.map(locale => 'TimeAgo.addLocale(require("javascript-time-ago/locale/' + locale + '.json"))').join('\n')}
`
.trim())

// Write `index.cjs.js` file.
fs.writeFileSync(path.resolve('./load-all-locales/index.cjs.js'),
`
// This file id deprecated.
// It's the same as \`index.cjs\`, just with an added \`.js\` file extension.
// It only exists for compatibility with the software that doesn't like \`*.cjs\` file extension.
// https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/61#note_950728292

var TimeAgo = require("javascript-time-ago")
${locales.map(locale => 'TimeAgo.addLocale(require("javascript-time-ago/locale/' + locale + '.json"))').join('\n')}
`
.trim())

// ES6
// `
// import TimeAgo from "javascript-time-ago"
//
// ${locales.map(locale => 'import ' + locale + ' from "javascript-time-ago/locale/' + locale + '"').join('\n')}
//
// ${locales.map(locale => 'TimeAgo.addLocale(' + locale + ')').join('\n')}
// `

// Transforms a locale name to a javascript variable name.
// Example: "zh-Hant-MO" -> "zh_Hant_MO"
// Example: "en-001" -> "en_001"
function getLocaleVariableName(locale) {
	return locale.replace(/[^a-zA-Z_\d]/g, '_')
}