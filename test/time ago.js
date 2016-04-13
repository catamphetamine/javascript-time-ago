// import chai from 'chai'
// chai.should()

// import javascript_time_ago from '../source/time ago'

import javascript_time_ago, { a_day, days_in_a_month, days_in_a_year, from_CLDR, gradation } from '../source'

// Load locale specific relative date/time messages
import { short as english_short_cldr, long as english_long_cldr } from './locales/en-cldr'
import english, { short as english_short, long as english_long, tiny as english_tiny } from '../locales/en'
import russian, { short as russian_short, long as russian_long, tiny as russian_tiny }  from '../locales/ru'

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
//
global.IntlMessageFormat = require('intl-messageformat')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')
delete global.IntlMessageFormat

describe(`time ago`, function()
{
	beforeEach(function()
	{
		// Set locale specific relative date/time messages
		javascript_time_ago.locale('en', english_long)
		javascript_time_ago.locale('ru', russian_long)
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

	// it(`should omit just now`, function()
	// {
	// 	javascript_time_ago.locale('en', english_short)
	//
	// 	const time_ago = new javascript_time_ago('en')
	//
	// 	const custom_gradation = gradation.convenient()
	// 	while (custom_gradation[0].unit !== 'minute')
	// 	{
	// 		custom_gradation.shift()
	// 	}
	//
	// 	const now = Date.now()
	// 	const elapsed = time => time_ago.format(now - time * 1000, { now, gradation: custom_gradation })
	//
	// 	elapsed(0        ).should.equal('')
	// 	elapsed(2.49 * 60).should.equal('')
	// 	elapsed(2.51 * 60).should.equal('5 min. ago')
	// })

	it(`should format Twitter style relative time (English)`, function()
	{
		javascript_time_ago.locale('en', english_tiny)
	
		const time_ago = new javascript_time_ago('en')
		const twitter_style = time_ago.style.twitter()
	
		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const elapsed = time => time_ago.format(now - time * 1000, { now, ...twitter_style })
	
		elapsed(0).should.equal('')
		elapsed(44.9).should.equal('')
		elapsed(45.1).should.equal('1m')
		elapsed(1.49 * 60).should.equal('1m')
		elapsed(1.51 * 60).should.equal('2m')
		elapsed(2.49 * 60).should.equal('2m')
		elapsed(2.51 * 60).should.equal('3m')
		// …
		elapsed(59.49 * 60).should.equal('59m')
		elapsed(59.51 * 60).should.equal('1h')
		elapsed(1.49 * 60 * 60).should.equal('1h')
		elapsed(1.51 * 60 * 60).should.equal('2h')
		elapsed(2.49 * 60 * 60).should.equal('2h')
		elapsed(2.51 * 60 * 60).should.equal('3h')
		// …
		elapsed(23.49 * 60 * 60).should.equal('23h')
		elapsed(a_day + 62 * 60).should.equal('Apr 9')
		// …
		elapsed(days_in_a_year * a_day).should.equal('Apr 11, 2015')
	})

	it(`should format Twitter style relative time (Russian)`, function()
	{
		javascript_time_ago.locale('ru', russian)
	
		const time_ago = new javascript_time_ago(['ru'])
		const twitter_style = time_ago.style.twitter()
	
		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const elapsed = time => time_ago.format(now - time * 1000, { now, ...twitter_style })
	
		elapsed(0).should.equal('')
		elapsed(44.9).should.equal('')
		elapsed(45.1).should.equal('1м')
		elapsed(1.49 * 60).should.equal('1м')
		elapsed(1.51 * 60).should.equal('2м')
		elapsed(2.49 * 60).should.equal('2м')
		elapsed(2.51 * 60).should.equal('3м')
		// …
		elapsed(59.49 * 60).should.equal('59м')
		elapsed(59.51 * 60).should.equal('1ч')
		elapsed(1.49 * 60 * 60).should.equal('1ч')
		elapsed(1.51 * 60 * 60).should.equal('2ч')
		elapsed(2.49 * 60 * 60).should.equal('2ч')
		elapsed(2.51 * 60 * 60).should.equal('3ч')
		// …
		elapsed(23.49 * 60 * 60).should.equal('23ч')
		elapsed(a_day + 62 * 60).should.equal('9 апр.')
		// …
		elapsed(days_in_a_year * a_day).should.equal('11 апр. 2015 г.')
	})

	it(`should format fuzzy style relative time (English)`, function()
	{
		javascript_time_ago.locale('en', english)

		const time_ago = new javascript_time_ago('en-US')

		convenient_gradation_test
		([
			'just now',
			'5 minutes',
			'10 minutes',
			'15 minutes',
			'20 minutes',
			'half an hour',
			'half an hour',
			'half an hour',
			'half an hour',
			'an hour',
			'an hour',
			'an hour',
			'2 hours',
			'3 hours',
			'4 hours',
			'5 hours',
			'6 hours',
			'7 hours',
			'8 hours',
			'9 hours',
			'10 hours',
			'11 hours',
			'12 hours',
			'13 hours',
			'14 hours',
			'15 hours',
			'16 hours',
			'17 hours',
			'18 hours',
			'19 hours',
			'20 hours',
			'yesterday',
			'2 days',
			'3 days',
			'4 days',
			'5 days',
			'a week',
			'2 weeks',
			'3 weeks',
			'a month',
			'2 months',
			'3 months',
			'4 months',
			'half a year',
			'half a year',
			'half a year',
			'half a year',
			'half a year',
			'a year',
			'a year',
			'a year',
			'2 years',
			'3 years',
			'100 years'
		],
		time_ago,
		time_ago.style.fuzzy())
	})

	it(`should format fuzzy style relative time (Russian)`, function()
	{
		javascript_time_ago.locale('ru', russian)

		const time_ago = new javascript_time_ago('ru-RU')

		convenient_gradation_test
		([
			'только что',
			'5 минут',
			'10 минут',
			'15 минут',
			'20 минут',
			'полчаса',
			'полчаса',
			'полчаса',
			'полчаса',
			'час',
			'час',
			'час',
			'2 часа',
			'3 часа',
			'4 часа',
			'5 часов',
			'6 часов',
			'7 часов',
			'8 часов',
			'9 часов',
			'10 часов',
			'11 часов',
			'12 часов',
			'13 часов',
			'14 часов',
			'15 часов',
			'16 часов',
			'17 часов',
			'18 часов',
			'19 часов',
			'20 часов',
			'вчера',
			'2 дня',
			'3 дня',
			'4 дня',
			'5 дней',
			'неделю',
			'2 недели',
			'3 недели',
			'месяц',
			'2 месяца',
			'3 месяца',
			'4 месяца',
			'полгода',
			'полгода',
			'полгода',
			'полгода',
			'полгода',
			'год',
			'год',
			'год',
			'2 года',
			'3 года',
			'100 лет'
		],
		time_ago,
		time_ago.style.fuzzy())
	})

	it(`should reduce locale to language code`, function()
	{
		javascript_time_ago.locale('ru', russian_tiny)
	
		const time_ago = new javascript_time_ago(['ru-RU'])
	
		const twitter_style = time_ago.style.twitter()
	
		const now = Date.now()
		const elapsed = time => time_ago.format(now - time * 1000, { now })
	
		elapsed(45.1).should.equal('45с')
		elapsed(45.1 * 60).should.equal('45м')
	})

	it(`should format time correctly for English language (short)`, function()
	{
		const units = ['just-now', 'minute', 'half-hour', 'hour', 'day', 'week', 'month', 'half-year', 'year']

		javascript_time_ago.locale('en', english_short)

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
		new javascript_time_ago('en'),
		{ units })
	})

	it(`should format time correctly for English language (long)`, function()
	{
		const units = ['just-now', 'minute', 'half-hour', 'hour', 'day', 'week', 'month', 'half-year', 'year']

		javascript_time_ago.locale('en', english_long)

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
		new javascript_time_ago('en'),
		{ units })
	})

	it(`should format time correctly for Russian language (short)`, function()
	{
		const units = ['just-now', 'minute', 'half-hour', 'hour', 'day', 'week', 'month', 'half-year', 'year']

		javascript_time_ago.locale('ru', russian_short)

		convenient_gradation_test
		([
			'только что',
			'5 мин. назад',
			'10 мин. назад',
			'15 мин. назад',
			'20 мин. назад',
			'25 мин. назад',
			'30 мин. назад',
			'35 мин. назад',
			'40 мин. назад',
			'45 мин. назад',
			'50 мин. назад',
			'1 ч. назад',
			'2 ч. назад',
			'3 ч. назад',
			'4 ч. назад',
			'5 ч. назад',
			'6 ч. назад',
			'7 ч. назад',
			'8 ч. назад',
			'9 ч. назад',
			'10 ч. назад',
			'11 ч. назад',
			'12 ч. назад',
			'13 ч. назад',
			'14 ч. назад',
			'15 ч. назад',
			'16 ч. назад',
			'17 ч. назад',
			'18 ч. назад',
			'19 ч. назад',
			'20 ч. назад',
			'вчера',
			'2 д. назад',
			'3 д. назад',
			'4 д. назад',
			'5 д. назад',
			'1 нед. назад',
			'2 нед. назад',
			'3 нед. назад',
			'1 мес. назад',
			'2 мес. назад',
			'3 мес. назад',
			'4 мес. назад',
			'5 мес. назад',
			'6 мес. назад',
			'7 мес. назад',
			'8 мес. назад',
			'9 мес. назад',
			'9 мес. назад',
			'10 мес. назад',
			'1 г. назад',
			'2 г. назад',
			'3 г. назад',
			'100 л. назад'
		],
		new javascript_time_ago('ru'),
		{ units })
	})

	it(`should format time correctly for Russian language (long)`, function()
	{
		const units = ['just-now', 'minute', 'half-hour', 'hour', 'day', 'week', 'month', 'half-year', 'year']

		javascript_time_ago.locale('ru', russian_long)

		convenient_gradation_test
		([
			'только что',
			'5 минут назад',
			'10 минут назад',
			'15 минут назад',
			'20 минут назад',
			'полчаса назад',
			'полчаса назад',
			'полчаса назад',
			'полчаса назад',
			'час назад',
			'час назад',
			'час назад',
			'2 часа назад',
			'3 часа назад',
			'4 часа назад',
			'5 часов назад',
			'6 часов назад',
			'7 часов назад',
			'8 часов назад',
			'9 часов назад',
			'10 часов назад',
			'11 часов назад',
			'12 часов назад',
			'13 часов назад',
			'14 часов назад',
			'15 часов назад',
			'16 часов назад',
			'17 часов назад',
			'18 часов назад',
			'19 часов назад',
			'20 часов назад',
			'вчера',
			'2 дня назад',
			'3 дня назад',
			'4 дня назад',
			'5 дней назад',
			'неделю назад',
			'2 недели назад',
			'3 недели назад',
			'месяц назад',
			'2 месяца назад',
			'3 месяца назад',
			'4 месяца назад',
			'полгода назад',
			'полгода назад',
			'полгода назад',
			'полгода назад',
			'полгода назад',
			'год назад',
			'год назад',
			'год назад',
			'2 года назад',
			'3 года назад',
			'100 лет назад'
		],
		new javascript_time_ago('ru'),
		{ units })
	})
})

function convenient_gradation_test(convenient_gradation_labels, time_ago, options = {})
{
	const now = Date.now()
	const elapsed = time => time_ago.format(now - time * 1000, { now, ...options })

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