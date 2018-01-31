import path from 'path'
import fs from 'fs'
// import javascript_time_ago from 'javascript-time-ago'
import javascript_time_ago from '../source/JavascriptTimeAgo'

const locales = []

fs.readdirSync(path.resolve(__dirname, '../locale')).forEach(function(locale)
{
	const locale_path = path.resolve(__dirname, '../locale', locale)
	if (fs.statSync(locale_path).isDirectory())
	{
		if (fs.existsSync(path.resolve(__dirname, '../locale', locale, 'index.js')))
		{
			locales.push(locale)
		}
	}
})

fs.writeFileSync(path.resolve(__dirname, '../load-all-locales.js'),
`
var TimeAgo = require("javascript-time-ago")
${locales.map(locale => 'TimeAgo.locale(require("javascript-time-ago/locale/' + locale + '"))').join('\n')}
`
.trim())

// ES6
// `
// import TimeAgo from "javascript-time-ago"
//
// ${locales.map(locale => 'import ' + locale + ' from "javascript-time-ago/locale/' + locale + '"').join('\n')}
//
// ${locales.map(locale => 'TimeAgo.locale(' + locale + ')').join('\n')}
// `