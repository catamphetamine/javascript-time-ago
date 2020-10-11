import TimeAgo from '../source/TimeAgo'
import { day, month, year } from '../source/steps'
import approximateStyle from '../source/style/approximate'
import { getLocaleData } from '../source/LocaleDataStore'

// Load locale specific relative date/time messages
import english from '../locale/en'

// Just so this function code is covered.
TimeAgo.setDefaultLocale('en')

describe(`javascript-time-ago`, () => {
	it('should try various label types until an appropriate one is found', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now(), { labels: ['exotic', 'short'] }).should.equal('just now')
	})

	it('should support the legacy name "flavour" of "labels"', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now(), { labels: ['exotic', 'short'] }).should.equal('just now')
	})

	it('should fallback to "second.current" for "now" when "now" is not defined', () => {
		const timeAgo = new TimeAgo('en')
		const englishNow = english.now
		delete english.now
		TimeAgo.addLocale(english)
		english.now = undefined
		timeAgo.format(Date.now(), { labels: 'long' }).should.equal('now')
		english.now = englishNow
		timeAgo.format(Date.now(), { labels: 'long' }).should.equal('just now')
	})

	it('should not use Intl.NumberFormat if it is not available', () => {
		const NumberFormat = Intl.NumberFormat
		delete Intl.NumberFormat
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now() + 60 * 1000, { labels: 'long-time' }).should.equal('1 minute')
		Intl.NumberFormat = NumberFormat
	})

	it('should work when "past"/"future" messages are same for all quantifiers', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now() + 365 * 24 * 60 * 60 * 1000, { labels: 'short' }).should.equal('in 1 yr.')
	})

	it('should work when "now" is a string (does not differentiate between "past" and "future")', () => {
		const timeAgo = new TimeAgo('en')
		const englishNow = english.now
		english.now = { now: 'now' }
		TimeAgo.addLocale(english)
		timeAgo.format(Date.now(), { labels: 'long' }).should.equal('now')
		english.now = englishNow
		timeAgo.format(Date.now(), { labels: 'long' }).should.equal('just now')
	})

	it('should work when a unit has formatting rules for "past" and "future" which are strings (style: not "long", not "short", not "narrow")', () => {
		const timeAgo = new TimeAgo('en')
		const englishLongTimeMinute = english['long-time'].minute
		english['long-time'].minute = {
			past: '{0} minute(s) ago',
			future: 'in {0} minute(s)'
		}
		TimeAgo.addLocale(english)
		// Past.
		timeAgo.format(Date.now() - 60 * 1000, { labels: 'long-time' }).should.equal('1 minute(s) ago')
		// Future (covers an "else" branch).
		timeAgo.format(Date.now() + 60 * 1000, { labels: 'long-time' }).should.equal('in 1 minute(s)')
		// Undo.
		english['long-time'].minute = englishLongTimeMinute
		timeAgo.format(Date.now() - 60 * 1000, { labels: 'long-time' }).should.equal('1 minute')
	})

	it(`should format "now" for "past" time`, () =>
	{
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now() + 10, { labels: ['long'] }).should.equal('in a moment')
	})

	it('should accept a string style argument', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now() - 1 * 1000, 'twitter').should.equal('1s')
		timeAgo.format(Date.now() - 45 * 1000, 'approximate').should.equal('just now')
		// "convenient" style was renamed to "approximate".
		timeAgo.format(Date.now() - 45 * 1000, 'convenient').should.equal('just now')
		timeAgo.format(Date.now() - 45 * 1000, 'round').should.equal('45 seconds ago')
		// "default" style was renamed to "round".
		timeAgo.format(Date.now() - 45 * 1000, 'default').should.equal('45 seconds ago')
		timeAgo.format(Date.now() - 45 * 1000, 'round-minute').should.equal('just now')
		// "time" style was renamed to "approximate-time".
		timeAgo.format(Date.now() - 2 * 60 * 1000, 'time').should.equal('2 minutes')
		timeAgo.format(Date.now() - 2 * 60 * 1000, 'approximate-time').should.equal('2 minutes')
		timeAgo.format(Date.now(), 'exotic').should.equal('just now')
	})

	it('should accept empty constructor parameters', () => {
		const timeAgo = new TimeAgo()
		timeAgo.format(new Date()).should.equal('just now')
	})

	it('should accept "mocked" Dates when testing', () => {
		const timeAgo = new TimeAgo('en')
		const mockedDate = { getTime: () => Date.now() }
		timeAgo.format(mockedDate).should.equal('just now')
	})

	it('should not accept anything but Dates and timestamps', () => {
		const timeAgo = new TimeAgo('en')
		const thrower = () => timeAgo.format('Jan 14, 2017')
		thrower.should.throw('Unsupported relative time formatter input: string, Jan 14, 2017')
	})

	it('should return an empty string if the specified units are not available in locale data', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now(), { units: ['femtosecond'] }).should.equal('')
	})

	it('should return an empty string if no unit is suitable', () => {
		const timeAgo = new TimeAgo('en')
		const now = Date.now()

		// Remove 'now' unit formatting rule temporarily
		const justNowFormatter = getLocaleData('en').now
		const currentSecondMessage = getLocaleData('en').long.second.current
		delete getLocaleData('en').now
		delete getLocaleData('en').long.second.current

		timeAgo.format(now, { now }).should.equal('')

		// Restore 'now' unit formating rule
		getLocaleData('en').now = justNowFormatter
		getLocaleData('en').long.second.current = currentSecondMessage
	})

	it('should format for a style with "custom" function', () => {
		const timeAgo = new TimeAgo('en')

		// `custom` returns a string
		timeAgo.format(Date.now(), {
			custom({ now, time, date, locale }) {
				return locale
			}
		})
		.should.equal('en')

		// `custom` returns `undefined`
		timeAgo.format(Date.now(), {
			custom({ now, time, date, locale }) {
				return
			}
		})
		.should.equal('just now')
	})

	it(`should format time correctly for English language (short)`, () =>
	{
		approximateScaleStepsTest
		([
			'just now',
			'1 min. ago',
			'2 min. ago',
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
			'1 day ago',
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
		'en',
		{ labels: 'short' })
	})

	it(`should format time correctly for English language (long)`, () =>
	{
		approximateScaleStepsTest
		([
			'just now',
			'1 minute ago',
			'2 minutes ago',
			'5 minutes ago',
			'10 minutes ago',
			'15 minutes ago',
			'20 minutes ago',
			'25 minutes ago',
			'30 minutes ago',
			'35 minutes ago',
			'40 minutes ago',
			'45 minutes ago',
			'50 minutes ago',
			'1 hour ago',
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
			'1 day ago',
			'2 days ago',
			'3 days ago',
			'4 days ago',
			'5 days ago',
			'1 week ago',
			'2 weeks ago',
			'3 weeks ago',
			'1 month ago',
			'2 months ago',
			'3 months ago',
			'4 months ago',
			'5 months ago',
			'6 months ago',
			'7 months ago',
			'8 months ago',
			'9 months ago',
			'9 months ago',
			'10 months ago',
			'1 year ago',
			'2 years ago',
			'3 years ago',
			'100 years ago'
		],
		'en',
		approximateStyle)
	})

	it('should format time correctly for Russian language (short)', () =>
	{
		approximateScaleStepsTest
		([
			'только что',
			'1 мин. назад',
			'2 мин. назад',
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
			'1 ч. назад',
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
			'1 дн. назад',
			'2 дн. назад',
			'3 дн. назад',
			'4 дн. назад',
			'5 дн. назад',
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
		'ru',
		{ labels: 'short' })
	})

	it('should format time correctly for Russian language (long)', () =>
	{
		approximateScaleStepsTest
		([
			'только что',
			'1 минуту назад',
			'2 минуты назад',
			'5 минут назад',
			'10 минут назад',
			'15 минут назад',
			'20 минут назад',
			'25 минут назад',
			'30 минут назад',
			'35 минут назад',
			'40 минут назад',
			'45 минут назад',
			'50 минут назад',
			'1 час назад',
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
			'1 день назад',
			'2 дня назад',
			'3 дня назад',
			'4 дня назад',
			'5 дней назад',
			'1 неделю назад',
			'2 недели назад',
			'3 недели назад',
			'1 месяц назад',
			'2 месяца назад',
			'3 месяца назад',
			'4 месяца назад',
			'5 месяцев назад',
			'6 месяцев назад',
			'7 месяцев назад',
			'8 месяцев назад',
			'9 месяцев назад',
			'9 месяцев назад',
			'10 месяцев назад',
			'1 год назад',
			'2 года назад',
			'3 года назад',
			'100 лет назад'
		],
		'ru',
		approximateStyle)
	})

	it('should format future dates', () => {
		new TimeAgo('en').format(Date.now() + 60 * 60 * 1000).should.equal('in 1 hour')
		new TimeAgo('ru').format(Date.now() + 60 * 1000).should.equal('через 1 минуту')
	})

	it('should accept "future" option', () => {
		// "now" unit.
		new TimeAgo('en').format(Date.now()).should.equal('just now')
		new TimeAgo('en').format(Date.now(), 'approximate', { future: true }).should.equal('in a moment')

		// Non-"now" unit, "long" style.
		// const style = {
		// 	gradation: [{
		// 		factor: 1,
		// 		unit: 'second'
		// 	}],
		// 	labels: 'long'
		// }
		// new TimeAgo('en').format(Date.now(), style).should.equal('0 seconds ago')
		// new TimeAgo('en').format(Date.now(), style, { future: true }).should.equal('in 0 seconds')

		// Non-"now" unit, "mini-time" style.
		const style2 = {
			style: [{
				unit: 'year'
			}],
			labels: 'mini-time'
		}
		new TimeAgo('ru').format(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000, style2).should.equal('5 л')
		new TimeAgo('ru').format(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000, style2, { future: true }).should.equal('5 л')
	})

	it('should support the legacy properties: "gradation", "flavour", "factor", "unit", "\'tiny\'" labels style', () => {
		// Non-"now" unit, "tiny" style.
		const style = {
			gradation: [{
				factor: 5,
				unit: 'year'
			}],
			flavour: 'tiny'
		}
		new TimeAgo('ru').format(Date.now() - 10 * 1000, style).should.equal('2 г')
		new TimeAgo('ru').format(Date.now() - 10 * 1000, style, { future: true }).should.equal('2 г')
	})

	it('should have generated missing quantifier functions for locales that do not have it in CLDR data', () => {
		new TimeAgo('ccp').format(Date.now() + 60 * 1000).should.equal('1 𑄟𑄨𑄚𑄨𑄘𑄬')
	})

	it('should throw for non-existing locales', () => {
		(() => TimeAgo.addLocale()).should.throw('No locale data passed')
	})

	it('should choose "future" variant of a label for `0` if "future: true" option is passed', () => {
		TimeAgo.addLocale(english)
		const secondLabels = english['mini-time'].second
		english['mini-time'].second = {
			past: '{0} seconds ago',
			future: 'in {0} seconds'
		}

		new TimeAgo('en').format(Date.now(), {
			steps: [{
				unit: 'second'
			}],
			// Uses "mini-time" labels so that it doesn't use `Intl.RelativeTimeFormat`.
			labels: 'mini-time'
		}).should.equal('0 seconds ago')

		new TimeAgo('en').format(Date.now(), {
			steps: [{
				unit: 'second'
			}],
			// Uses "mini-time" labels so that it doesn't use `Intl.RelativeTimeFormat`.
			labels: 'mini-time'
		}, {
			future: true
		}).should.equal('in 0 seconds')

		english['mini-time'].second = secondLabels
	})

	it('should get time to next update', () => {
		const timeAgo = new TimeAgo('en')
		const now = Date.now()
		timeAgo.format(now + 1000, 'twitter', {
			getTimeToNextUpdate: true,
			now
		}).should.deep.equal([
			'1s',
			500
		])
	})

	it('should pass `formatAs()` in `step.format()`', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now(), {
			labels: 'long',
			steps: [{
				format(date, locale, { formatAs }) {
					return formatAs('second', 1)
				}
			}]
		}).should.equal('in 1 second')
	})

	it('should support `polyfill: false` option', () => {
		const timeAgo = new TimeAgo('en', { polyfill: false })
		// Still uses "now" labels, even when not polyfilled.
		timeAgo.format(Date.now(), 'round').should.equal('just now')
		timeAgo.format(Date.now() + 1000, 'round').should.equal('in 1 second')
	})

	it('should not use Intl.NumberFormat if it is not available', () => {
		const Intl = global.Intl
		global.Intl = undefined
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now() + 1000, 'round').should.equal('in 1 second')
		global.Intl = Intl
	})

	it('should format `0` in past mode by default', () => {
		new TimeAgo('en').format(0, {
			labels: 'long',
			steps: [{
				formatAs: 'second'
			}]
		}, { now: 0 }).should.equal('0 seconds ago')
	})

	it('should format `0` in future mode when `future: true` option was passed', () => {
		new TimeAgo('en').format(0, {
			labels: 'long',
			steps: [{
				formatAs: 'second'
			}]
		}, { now: 0, future: true }).should.equal('in 0 seconds')
	})

	it('should throw if a step does not define `formatAs` or `format()`', () => {
		const timeAgo = new TimeAgo('en')
		expect(() => timeAgo.format(Date.now() + 1000, {
			labels: 'long',
			steps: [{}]
		})).to.throw('Each step must define either `formatAs` or `format()`.')
	})

	it('should add default locale', () => {
		TimeAgo.getDefaultLocale().should.equal('en')
		TimeAgo.addDefaultLocale({
			locale: 'el'
		})
		TimeAgo.getDefaultLocale().should.equal('el')
		expect(() => {
			TimeAgo.addDefaultLocale({
				locale: 'el'
			})
		}).to.throw('`TimeAgo.addDefaultLocale()` can only be called once')
		TimeAgo.setDefaultLocale('en')
	})
})

export function approximateScaleStepsTest(labels, timeAgo, style = {}) {
	if (typeof timeAgo === 'string') {
		timeAgo = new TimeAgo(timeAgo)
	}

	const now = Date.now()
	const elapsed = time => timeAgo.format(now - time * 1000, { now, ...style })

	if (approximateScaleSteps.length !== labels.length) {
		throw new Error(`Array length mismatch. Steps: ${approximateScaleSteps.length}, labels: ${labels.length}`)
	}

	let i = 0
	while (i < approximateScaleSteps.length) {
		for (let time of approximateScaleSteps[i]) {
			elapsed(time).should.equal(labels[i])
		}
		i++
	}
}

const approximateScaleSteps =
[
	// 'just now':
	[
		0,
		40.49
	],
	// '1 minute ago':
	[
		45.5,
		1.49 * 60
	],
	// '2 minutes ago':
	[
		1.51 * 60,
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
	// '1 hour ago':
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
	// '1 day ago':
	[
		20.51 * 60 * 60,
		1.49  * day
	],
	// '2 days ago':
	[
		1.51  * day,
		2.49  * day
	],
	// '3 days ago':
	[
		2.51  * day,
		3.49  * day
	],
	// '4 days ago':
	[
		3.51  * day,
		4.49  * day
	],
	// '5 days ago':
	[
		4.51  * day,
		5.49  * day
	],
	// '1 week ago':
	[
		5.51  * day,
		1.49  * 7 * day
	],
	// '2 weeks ago':
	[
		1.51  * 7 * day,
		2.49  * 7 * day
	],
	// '3 weeks ago':
	[
		2.51  * 7 * day,
		3.49  * 7 * day
	],
	// '1 month ago':
	[
		3.51  * 7 * day,
		1.49  * month
	],
	// '2 months ago':
	[
		1.51  * month,
		2.49  * month
	],
	// '3 months ago':
	[
		2.51  * month,
		3.49  * month
	],
	// '4 months ago':
	[
		3.51  * month,
		4.49  * month
	],
	// '5 months ago':
	[
		4.51  * month,
		5.49  * month
	],
	// '6 months ago':
	[
		5.51  * month,
		6.49  * month
	],
	// '7 months ago':
	[
		6.51  * month,
		7.49  * month
	],
	// '8 months ago':
	[
		7.51  * month,
		8.49  * month
	],
	// '9 months ago':
	[
		8.51  * month,
		8.99  * month
	],
	// '9 months ago':
	[
		9.01  * month,
		9.49  * month
	],
	// '10 months ago':
	[
		9.51  * month,
		10.49  * month
	],
	// '1 year ago':
	[
		10.51 * month,
		1.49  * year
	],
	// '2 years ago':
	[
		1.51  * year,
		2.49  * year
	],
	// '3 years ago':
	[
		2.51  * year,
		3.49  * year
	],
	// '100 years ago':
	[
		99.51  * year,
		100.49 * year
	]
]