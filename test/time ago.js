// import chai from 'chai'
// chai.should()

// import react_time_ago from '../source/time ago'

import react_time_ago, { a_day, days_in_a_month, days_in_a_year, from_CLDR, gradation } from '../source'

// Load locale specific relative date/time messages
import { short as english_short_cldr, long as english_long_cldr } from './locales/en-cldr'
import { short as english_short, long as english_long } from '../source/locales/en'
import { short as russian_short, long as russian_long }  from '../source/locales/ru'

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
//
global.IntlMessageFormat = require('../node_modules/intl-messageformat')
require('../node_modules/intl-messageformat/dist/locale-data/en')
require('../node_modules/intl-messageformat/dist/locale-data/ru')
delete global.IntlMessageFormat

describe(`time ago`, function()
{
	beforeEach(function()
	{
		// Set locale specific relative date/time messages
		react_time_ago.locale('en', english_long)
		react_time_ago.locale('ru', russian_long)
	})

	afterEach(function()
	{
		//
	})

	it(`should convert from Unicode CLDR`, function()
	{
		from_CLDR(english_short_cldr).should.deep.equal(english_short)
		from_CLDR(english_long_cldr).should.deep.equal(english_long)
	})

	it(`should omit just now`, function()
	{
		react_time_ago.locale('en', english_short)

		const time_ago = new react_time_ago('en')

		const custom_gradation = gradation.convenient()
		while (custom_gradation[0].unit !== 'minute')
		{
			custom_gradation.shift()
		}

		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now, gradation: custom_gradation })

		elapsed(0        ).should.equal('')
		elapsed(2.49 * 60).should.equal('')
		elapsed(2.51 * 60).should.equal('5 min. ago')
	})

	it(`should format time correctly for English language (short)`, function()
	{
		react_time_ago.locale('en', english_short)

		convenient_gradation_test
		([
			'now',
			'5 min. ago',
			'10 min. ago',
			'15 min. ago',
			'20 min. ago',
			'25 min. ago',
			'30 min. ago',
			'35 min. ago',
			'40 min. ago',
			'45 min. ago',
			'50 min. ago',
			'1 hr. ago',
			'2 hr. ago',
			'3 hr. ago',
			'4 hr. ago',
			'5 hr. ago',
			'6 hr. ago',
			'7 hr. ago',
			'8 hr. ago',
			'9 hr. ago',
			'10 hr. ago',
			'11 hr. ago',
			'12 hr. ago',
			'13 hr. ago',
			'14 hr. ago',
			'15 hr. ago',
			'16 hr. ago',
			'17 hr. ago',
			'18 hr. ago',
			'19 hr. ago',
			'20 hr. ago',
			'yesterday',
			'2 days ago',
			'3 days ago',
			'4 days ago',
			'5 days ago',
			'1 wk. ago',
			'2 wk. ago',
			'3 wk. ago',
			'1 mo. ago',
			'2 mo. ago',
			'3 mo. ago',
			'4 mo. ago',
			'5 mo. ago',
			'6 mo. ago',
			'7 mo. ago',
			'8 mo. ago',
			'9 mo. ago',
			'9 mo. ago',
			'10 mo. ago',
			'1 yr. ago',
			'2 yr. ago',
			'3 yr. ago',
			'100 yr. ago'
		],
		new react_time_ago('en'))
	})

	it(`should format time correctly for English language (long)`, function()
	{
		react_time_ago.locale('en', english_long)

		convenient_gradation_test
		([
			'just now',
			'5 minutes ago',
			'10 minutes ago',
			'15 minutes ago',
			'20 minutes ago',
			'half an hour ago',
			'half an hour ago',
			'half an hour ago',
			'half an hour ago',
			'an hour ago',
			'an hour ago',
			'an hour ago',
			'2 hours ago',
			'3 hours ago',
			'4 hours ago',
			'5 hours ago',
			'6 hours ago',
			'7 hours ago',
			'8 hours ago',
			'9 hours ago',
			'10 hours ago',
			'11 hours ago',
			'12 hours ago',
			'13 hours ago',
			'14 hours ago',
			'15 hours ago',
			'16 hours ago',
			'17 hours ago',
			'18 hours ago',
			'19 hours ago',
			'20 hours ago',
			'yesterday',
			'2 days ago',
			'3 days ago',
			'4 days ago',
			'5 days ago',
			'a week ago',
			'2 weeks ago',
			'3 weeks ago',
			'a month ago',
			'2 months ago',
			'3 months ago',
			'4 months ago',
			'half a year ago',
			'half a year ago',
			'half a year ago',
			'half a year ago',
			'half a year ago',
			'a year ago',
			'a year ago',
			'a year ago',
			'2 years ago',
			'3 years ago',
			'100 years ago'
		],
		new react_time_ago('en'))
	})

	it(`should format time correctly for Russian language (short)`, function()
	{
		react_time_ago.locale('ru', russian_short)

		const time_ago = new react_time_ago('ru')

		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now })

		elapsed(0     ).should.equal('1 сек. назад')
	})

	it(`should format time correctly for Russian language (long)`, function()
	{
		react_time_ago.locale('ru', russian_long)

		const time_ago = new react_time_ago('ru')
		
		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now })

		elapsed(0     ).should.equal('1 секунду назад')
	})

	it(`should throw an error when an appropriate locale data hasn't been found`, function()
	{
		// ...
	})
})

function convenient_gradation_test(convenient_gradation_labels, time_ago)
{
	const units = ['just-now', 'minute', 'half-hour', 'hour', 'day', 'week', 'month', 'half-year', 'year']

	const now = Date.now()
	const elapsed = time => time_ago.format(now + time * 1000, { now, units })

	if (convenient_gradation.length !== convenient_gradation_labels.length)
	{
		throw new Error(`Array length mismatch. Gradation steps: ${convenient_gradation.length}, labels: ${convenient_gradation_labels.length}`)
	}

	let i = 0
	while (i < convenient_gradation.length)
	{
		for (let time of convenient_gradation[i])
		{
			elapsed(time).should.equal(convenient_gradation_labels[i])
		}

		i++
	}
}

const convenient_gradation =
[
	// 'just now':
	[
		0,
		2.49 * 60
	],
	// '5 minutes ago':
	[
		2.51 * 60,
		7.49 * 60
	],
	// '10 minutes ago':
	[
		7.51  * 60,
		12.49 * 60
	],
	// '15 minutes ago':
	[
		12.51 * 60,
		17.49 * 60
	],
	// '20 minutes ago':
	[
		17.51 * 60,
		22.49 * 60
	],
	// '25 minutes ago':
	[
		22.51 * 60,
		27.49 * 60
	],
	// '30 minutes ago':
	[
		27.51 * 60,
		32.49 * 60
	],
	// '35 minutes ago':
	[
		32.51 * 60,
		37.49 * 60
	],
	// '40 minutes ago':
	[
		37.51 * 60,
		42.49 * 60
	],
	// '45 minutes ago':
	[
		42.51 * 60,
		47.49 * 60
	],
	// '50 minutes ago':
	[
		47.51 * 60,
		52.49 * 60
	],
	// 'an hour ago':
	[
		55.01 * 60,
		1.49  * 60 * 60
	],
	// '2 hours ago':
	[
		1.51  * 60 * 60,
		2.49  * 60 * 60
	],
	// '3 hours ago':
	[
		2.51  * 60 * 60,
		3.49  * 60 * 60
	],
	// '4 hours ago':
	[
		3.51  * 60 * 60,
		4.49  * 60 * 60
	],
	// '5 hours ago':
	[
		4.51  * 60 * 60,
		5.49  * 60 * 60
	],
	// '6 hours ago':
	[
		5.51  * 60 * 60,
		6.49  * 60 * 60
	],
	// '7 hours ago':
	[
		6.51  * 60 * 60,
		7.49  * 60 * 60
	],
	// '8 hours ago':
	[
		7.51  * 60 * 60,
		8.49  * 60 * 60
	],
	// '9 hours ago':
	[
		8.51  * 60 * 60,
		9.49  * 60 * 60
	],
	// '10 hours ago':
	[
		9.51  * 60 * 60,
		10.49 * 60 * 60
	],
	// '11 hours ago':
	[
		10.51 * 60 * 60,
		11.49 * 60 * 60
	],
	// '12 hours ago':
	[
		11.51 * 60 * 60,
		12.49 * 60 * 60
	],
	// '13 hours ago':
	[
		12.51 * 60 * 60,
		13.49 * 60 * 60
	],
	// '14 hours ago':
	[
		13.51 * 60 * 60,
		14.49 * 60 * 60
	],
	// '15 hours ago':
	[
		14.51 * 60 * 60,
		15.49 * 60 * 60
	],
	// '16 hours ago':
	[
		15.51 * 60 * 60,
		16.49 * 60 * 60
	],
	// '17 hours ago':
	[
		16.51 * 60 * 60,
		17.49 * 60 * 60
	],
	// '18 hours ago':
	[
		17.51 * 60 * 60,
		18.49 * 60 * 60
	],
	// '19 hours ago':
	[
		18.51 * 60 * 60,
		19.49 * 60 * 60
	],
	// '20 hours ago':
	[
		19.51 * 60 * 60,
		20.49 * 60 * 60
	],
	// 'yesterday':
	[
		20.51 * 60 * 60,
		1.49  * a_day
	],
	// '2 days ago':
	[
		1.51  * a_day,
		2.49  * a_day
	],
	// '3 days ago':
	[
		2.51  * a_day,
		3.49  * a_day
	],
	// '4 days ago':
	[
		3.51  * a_day,
		4.49  * a_day
	],
	// '5 days ago':
	[
		4.51  * a_day,
		5.49  * a_day
	],
	// 'a week ago':
	[
		5.51  * a_day,
		1.49  * 7 * a_day
	],
	// '2 weeks ago':
	[
		1.51  * 7 * a_day,
		2.49  * 7 * a_day
	],
	// '3 weeks ago':
	[
		2.51  * 7 * a_day,
		3.49  * 7 * a_day
	],
	// 'a month ago':
	[
		3.51  * 7 * a_day,
		1.49  * days_in_a_month * a_day
	],
	// '2 months ago':
	[
		1.51  * days_in_a_month * a_day,
		2.49  * days_in_a_month * a_day
	],
	// '3 months ago':
	[
		2.51  * days_in_a_month * a_day,
		3.49  * days_in_a_month * a_day
	],
	// '4 months ago':
	[
		3.51  * days_in_a_month * a_day,
		4.49  * days_in_a_month * a_day
	],
	// '5 months ago':
	[
		4.51  * days_in_a_month * a_day,
		5.49  * days_in_a_month * a_day
	],
	// '6 months ago':
	[
		5.51  * days_in_a_month * a_day,
		6.49  * days_in_a_month * a_day
	],
	// '7 months ago':
	[
		6.51  * days_in_a_month * a_day,
		7.49  * days_in_a_month * a_day
	],
	// '8 months ago':
	[
		7.51  * days_in_a_month * a_day,
		8.49  * days_in_a_month * a_day
	],
	// '9 months ago':
	[
		8.51  * days_in_a_month * a_day,
		8.99  * days_in_a_month * a_day
	],
	// '9 months ago':
	[
		9.01  * days_in_a_month * a_day,
		9.49  * days_in_a_month * a_day
	],
	// '10 months ago':
	[
		9.51  * days_in_a_month * a_day,
		10.49  * days_in_a_month * a_day
	],
	// 'a year ago':
	[
		10.51 * days_in_a_month * a_day,
		1.49  * days_in_a_year * a_day
	],
	// '2 years ago':
	[
		1.51  * days_in_a_year * a_day,
		2.49  * days_in_a_year * a_day
	],
	// '3 years ago':
	[
		2.51  * days_in_a_year * a_day,
		3.49  * days_in_a_year * a_day
	],
	// '100 years ago':
	[
		99.51  * days_in_a_year * a_day,
		100.49 * days_in_a_year * a_day
	]
]