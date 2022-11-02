import TimeAgo from './TimeAgo.js'
import { getLocaleData } from './LocaleDataStore.js'

// Load locale specific relative date/time messages
import english from '../locale/en.json' assert { type: 'json' }

// Just so this function code is covered.
TimeAgo.setDefaultLocale('en')

describe(`javascript-time-ago`, () => {
	it('should default to "round-minute" style', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now()).should.equal('just now')
		timeAgo.format(Date.now() + 20 * 1000).should.equal('in a moment')
		timeAgo.format(Date.now() + 1 * 60 * 1000).should.equal('in 1 minute')
		timeAgo.format(Date.now() + 4 * 60 * 1000).should.equal('in 4 minutes')
	})

	it('should tell `options` argument from `style` argument', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now(), 'mini-now').should.equal('now')
		timeAgo.format(0, { future: true, now: 0 }).should.equal('in a moment')
		timeAgo.format(0, { labels: 'mini', steps: [{ formatAs: 'now' }, { formatAs: 'second' }] }, { future: true, now: 0 }).should.equal('now')
		timeAgo.format(0, { labels: ['mini'], steps: [{ formatAs: 'now' }, { formatAs: 'second' }] }, { future: true, now: 0 }).should.equal('now')
		// `flavour` is a legacy name of `labels` property.
		timeAgo.format(0, { flavour: 'mini' }, { future: true, now: 0 }).should.equal('now')
		timeAgo.format(0, { flavour: ['mini'] }, { future: true, now: 0 }).should.equal('now')
		timeAgo.format(0, { steps: [{ formatAs: 'minute' }] }, { future: true, now: 0 }).should.equal('in 0 minutes')
		// `gradation` is a legacy name of `steps` property.
		timeAgo.format(0, { gradation: [{ formatAs: 'minute' }] }, { future: true, now: 0 }).should.equal('in 0 minutes')
	})

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

	it('should accept a string style name argument', () => {
		const timeAgo = new TimeAgo('en')
		// "mini".
		timeAgo.format(Date.now() - 0 * 1000, 'mini').should.equal('0s')
		timeAgo.format(Date.now() - 1 * 1000, 'mini').should.equal('1s')
		// "mini-now".
		timeAgo.format(Date.now() - 0 * 1000, 'mini-now').should.equal('now')
		timeAgo.format(Date.now() - 1 * 1000, 'mini-now').should.equal('1s')
		// "mini-minute-now".
		timeAgo.format(Date.now() - 29 * 1000, 'mini-minute-now').should.equal('now')
		timeAgo.format(Date.now() - 60 * 1000, 'mini-minute-now').should.equal('1m')
		// "mini-minute".
		timeAgo.format(Date.now() - 29 * 1000, 'mini-minute').should.equal('0m')
		timeAgo.format(Date.now() - 60 * 1000, 'mini-minute').should.equal('1m')
		// "twitter".
		timeAgo.format(Date.now() - 0 * 1000, 'twitter').should.equal('0s')
		timeAgo.format(Date.now() - 1 * 1000, 'twitter').should.equal('1s')
		// "twitter-now".
		timeAgo.format(Date.now() - 0 * 1000, 'twitter-now').should.equal('now')
		timeAgo.format(Date.now() - 1 * 1000, 'twitter-now').should.equal('1s')
		// "twitter-minute-now".
		timeAgo.format(Date.now() - 29 * 1000, 'twitter-minute-now').should.equal('now')
		timeAgo.format(Date.now() - 60 * 1000, 'twitter-minute-now').should.equal('1m')
		// "twitter-minute".
		timeAgo.format(Date.now() - 29 * 1000, 'twitter-minute').should.equal('0m')
		timeAgo.format(Date.now() - 60 * 1000, 'twitter-minute').should.equal('1m')
		// "twitter-first-minute".
		timeAgo.format(Date.now() - 29 * 1000, 'twitter-first-minute').should.equal('')
		timeAgo.format(Date.now() - 60 * 1000, 'twitter-first-minute').should.equal('1m')
		// "approximate".
		timeAgo.format(Date.now() - 45 * 1000, 'approximate').should.equal('just now')
		// "convenient" style was renamed to "approximate".
		timeAgo.format(Date.now() - 45 * 1000, 'convenient').should.equal('just now')
		timeAgo.format(Date.now() - 45 * 1000, 'round').should.equal('45 seconds ago')
		// "default" style was renamed to "round".
		timeAgo.format(Date.now() - 45 * 1000, 'default').should.equal('45 seconds ago')
		timeAgo.format(Date.now() - 29 * 1000, 'round-minute').should.equal('just now')
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

		// Non-"now" unit, "mini" style.
		const style2 = {
			style: [{
				unit: 'year'
			}],
			labels: 'mini'
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
		new TimeAgo('ccp').format(Date.now() + 60 * 1000).should.include(' 𑄟𑄨𑄚𑄨𑄘𑄬')
	})

	it('should throw for non-existing locales', () => {
		(() => TimeAgo.addLocale()).should.throw('No locale data passed')
	})

	it('should choose "future" variant of a label for `0` if "future: true" option is passed', () => {
		TimeAgo.addLocale(english)
		const secondLabels = english['mini'].second
		english['mini'].second = {
			past: '{0} seconds ago',
			future: 'in {0} seconds'
		}

		new TimeAgo('en').format(Date.now(), {
			steps: [{
				unit: 'second'
			}],
			// Uses "mini" labels so that it doesn't use `Intl.RelativeTimeFormat`.
			labels: 'mini'
		}).should.equal('0 seconds ago')

		new TimeAgo('en').format(Date.now(), {
			steps: [{
				unit: 'second'
			}],
			// Uses "mini" labels so that it doesn't use `Intl.RelativeTimeFormat`.
			labels: 'mini'
		}, {
			future: true
		}).should.equal('in 0 seconds')

		english['mini'].second = secondLabels
	})

	it('should get time to next update (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		timeAgo.format(1000, 'twitter', {
			getTimeToNextUpdate: true,
			now: 0,
			round: 'floor'
		}).should.deep.equal([
			'1s',
			1
		])
	})

	it('should get time to next update (round: "round")', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		timeAgo.format(1000, 'twitter', {
			getTimeToNextUpdate: true,
			now: 0
		}).should.deep.equal([
			'1s',
			501
		])
	})

	it('should get time to next update ("mini-now" style) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		// In 1 minute.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 0,
			round: 'floor'
		}).should.deep.equal([
			'1m',
			1
		])
		// Almost in 1 minute.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 1,
			round: 'floor'
		}).should.deep.equal([
			'59s',
			1000
		])
		// In 1 second.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000,
			round: 'floor'
		}).should.deep.equal([
			'1s',
			1
		])
		// Almost in 1 second.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000 + 1,
			round: 'floor'
		}).should.deep.equal([
			'now',
			// Right after zero point.
			1000
		])
		// Zero point (future to past).
		// `future: true`.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			future: true,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1
		])
		// Zero point (future to past).
		// `future: false`.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1000
		])
		// Right after zero point (past).
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1000 - 1
		])
		// 1 second ago.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1000,
			round: 'floor'
		}).should.deep.equal([
			'1s',
			1000
		])
	})

	it('should get time to next update ("mini-now" style) (round: "round")', () => {
		const timeAgo = new TimeAgo('en')
		// In 1 minute.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 0
		}).should.deep.equal([
			'1m',
			500 + 1
		])
		// Almost in 1 minute.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 500 + 1
		}).should.deep.equal([
			'59s',
			1000
		])
		// In 1 second.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59.5 * 1000
		}).should.deep.equal([
			'1s',
			1
		])
		// Almost in 1 second.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59.5 * 1000 + 1
		}).should.deep.equal([
			'now',
			// Right after zero point.
			500
		])
		// Zero point (future to past).
		// `future: true`.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			future: true
		}).should.deep.equal([
			'now',
			1
		])
		// Zero point (future to past).
		// `future: false`.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000
		}).should.deep.equal([
			'now',
			500
		])
		// Right after zero point (past).
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1
		}).should.deep.equal([
			'now',
			500 - 1
		])
		// 1 second ago.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 500
		}).should.deep.equal([
			'1s',
			1000
		])
	})

	it('should get time to next update (first step has non-zero "minTime") (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		// Future.
		// Inside the first step.
		// Updates soon.
		timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: -0.5 * 1000
		}).should.deep.equal([
			'1m',
			0.5 * 1000 + 1
		])

		// Future.
		// Outside of the first step.
		// Updates right after zero point.
		timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60 * 1000
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: 1 * 1000
		}).should.deep.equal([
			'',
			59 * 1000 + 1
		])

		// Zero point.
		// Outside of the first step.
		// Updates at the first step's `minTime`.
		timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: 60 * 1000
		}).should.deep.equal([
			'',
			60 * 1000
		])

		// Past.
		// Inside the first step.
		// Updates at the next minute.
		timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 60 * 1000
		}).should.deep.equal([
			'1m',
			60 * 1000
		])

		// Almost in 1 minute.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 1,
			round: 'floor'
		}).should.deep.equal([
			'59s',
			1000
		])
		// In 1 second.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000,
			round: 'floor'
		}).should.deep.equal([
			'1s',
			1
		])
		// Almost in 1 second.
		// Updates right after the zero point.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000 + 1,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1000
		])
		// Zero point (future to past).
		// `future: true`.
		// Updates right after zero point.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			future: true,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1
		])
		// Zero point (future to past).
		// `future: false`.
		// Updates at the next second.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1000
		])
		// Right after zero point (past).
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1,
			round: 'floor'
		}).should.deep.equal([
			'now',
			1000 - 1
		])
		// 1 second ago.
		timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1000,
			round: 'floor'
		}).should.deep.equal([
			'1s',
			1000
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
		timeAgo.format(0, 'round', { now: 0 }).should.equal('just now')
		timeAgo.format(1000, 'round', { now: 0 }).should.equal('in 1 second')
	})

	it('should not use Intl.NumberFormat if it is not available', () => {
		const Intl = global.Intl
		global.Intl = undefined
		const timeAgo = new TimeAgo('en')
		timeAgo.format(1000, 'round', { now: 0 }).should.equal('in 1 second')
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
		// expect(() => {
			TimeAgo.addDefaultLocale({
				locale: 'el'
			})
		// }).to.throw('`TimeAgo.addDefaultLocale()` can only be called once')
		TimeAgo.setDefaultLocale('en')
	})

	it('should support "floor" rounding', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(0.9 * 1000, 'twitter', { now: 0, round: 'floor' }).should.equal('0s')
		timeAgo.format(1 * 1000, 'twitter', { now: 0, round: 'floor' }).should.equal('1s')
		timeAgo.format(1.9 * 1000, 'twitter', { now: 0, round: 'floor' }).should.equal('1s')
		timeAgo.format(2 * 1000, 'twitter', { now: 0, round: 'floor' }).should.equal('2s')
		timeAgo.format(1.9 * 60 * 1000, 'twitter', { now: 0, round: 'floor' }).should.equal('1m')
		timeAgo.format(2 * 60 * 1000, 'twitter', { now: 0, round: 'floor' }).should.equal('2m')
	})
})