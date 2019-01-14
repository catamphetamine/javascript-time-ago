import path from 'path'
import fs from 'fs'

const locales = []

fs.readdirSync(path.resolve(__dirname, '../locale')).forEach((locale) => {
	const localePath = path.resolve(__dirname, '../locale', locale)
	if (fs.statSync(localePath).isDirectory()) {
		if (fs.existsSync(path.resolve(__dirname, '../locale', locale, 'index.js'))) {
			locales.push(locale)
		}
	}
})

fs.writeFileSync(path.resolve(__dirname, '../load-all-locales.js'),
`
var TimeAgo = require("javascript-time-ago")
${locales.map(locale => 'TimeAgo.addLocale(require("javascript-time-ago/locale/' + locale + '"))').join('\n')}
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