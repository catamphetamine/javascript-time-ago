import { describe, it } from 'mocha'
import { expect } from 'chai'

import TimeAgo from './TimeAgo.js'

// Load locale specific relative date/time messages
import english from '../locale/en.json' with { type: 'json' }

// Just so this function code is covered.
TimeAgo.setDefaultLocale('en')

describe(`javascript-time-ago`, () => {
	it('should default to "round-minute" style', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now())).to.equal('just now')
		expect(timeAgo.format(Date.now() + 20 * 1000)).to.equal('in a moment')
		expect(timeAgo.format(Date.now() + 1 * 60 * 1000)).to.equal('in 1 minute')
		expect(timeAgo.format(Date.now() + 4 * 60 * 1000)).to.equal('in 4 minutes')
	})

	it('should tell `options` argument from `style` argument', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now(), 'mini-now')).to.equal('now')
		expect(timeAgo.format(0, { future: true, now: 0 })).to.equal('in a moment')
		expect(timeAgo.format(0, { labels: 'mini', steps: [{ formatAs: 'now' }, { formatAs: 'second' }] }, { future: true, now: 0 })).to.equal('now')
		expect(timeAgo.format(0, { labels: ['mini'], steps: [{ formatAs: 'now' }, { formatAs: 'second' }] }, { future: true, now: 0 })).to.equal('now')
		// `flavour` is a legacy name of `labels` property.
		expect(timeAgo.format(0, { flavour: 'mini' }, { future: true, now: 0 })).to.equal('now')
		expect(timeAgo.format(0, { flavour: ['mini'] }, { future: true, now: 0 })).to.equal('now')
		expect(timeAgo.format(0, { steps: [{ formatAs: 'minute' }] }, { future: true, now: 0 })).to.equal('in 0 minutes')
		// `gradation` is a legacy name of `steps` property.
		expect(timeAgo.format(0, { gradation: [{ formatAs: 'minute' }] }, { future: true, now: 0 })).to.equal('in 0 minutes')
	})

	it('should try various label types until an appropriate one is found', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now(), { labels: ['exotic', 'short'] })).to.equal('just now')
	})

	it('should support the legacy name "flavour" of "labels"', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now(), { labels: ['exotic', 'short'] })).to.equal('just now')
	})

	it('should fallback to "second.current" for "now" when "now" is not defined', () => {
		const timeAgo = new TimeAgo('en')
		const englishNow = english.now
		delete english.now
		TimeAgo.addLocale(english)
		english.now = undefined
		expect(timeAgo.format(Date.now(), { labels: 'long' })).to.equal('now')
		english.now = englishNow
		expect(timeAgo.format(Date.now(), { labels: 'long' })).to.equal('just now')
	})

	it('should not use Intl.NumberFormat if it is not available', () => {
		const NumberFormat = Intl.NumberFormat
		delete Intl.NumberFormat
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now() + 60 * 1000, { labels: 'long-time' })).to.equal('1 minute')
		Intl.NumberFormat = NumberFormat
	})

	it('should work when "past"/"future" messages are same for all quantifiers', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now() + 365 * 24 * 60 * 60 * 1000, { labels: 'short' })).to.equal('in 1 yr.')
	})

	it('should work when "now" is a string (does not differentiate between "past" and "future")', () => {
		const timeAgo = new TimeAgo('en')
		const englishNow = english.now
		english.now = { now: 'now' }
		TimeAgo.addLocale(english)
		expect(timeAgo.format(Date.now(), { labels: 'long' })).to.equal('now')
		english.now = englishNow
		expect(timeAgo.format(Date.now(), { labels: 'long' })).to.equal('just now')
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
		expect(timeAgo.format(Date.now() - 60 * 1000, { labels: 'long-time' })).to.equal('1 minute(s) ago')
		// Future (covers an "else" branch).
		expect(timeAgo.format(Date.now() + 60 * 1000, { labels: 'long-time' })).to.equal('in 1 minute(s)')
		// Undo.
		english['long-time'].minute = englishLongTimeMinute
		expect(timeAgo.format(Date.now() - 60 * 1000, { labels: 'long-time' })).to.equal('1 minute')
	})

	it(`should format "now" for "past" time`, () =>
	{
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now() + 10, { labels: ['long'] })).to.equal('in a moment')
	})

	it('should accept a string style name argument', () => {
		const timeAgo = new TimeAgo('en')
		// "mini".
		expect(timeAgo.format(Date.now() - 0 * 1000, 'mini')).to.equal('0s')
		expect(timeAgo.format(Date.now() - 1 * 1000, 'mini')).to.equal('1s')
		// "mini-now".
		expect(timeAgo.format(Date.now() - 0 * 1000, 'mini-now')).to.equal('now')
		expect(timeAgo.format(Date.now() - 1 * 1000, 'mini-now')).to.equal('1s')
		// "mini-minute-now".
		expect(timeAgo.format(Date.now() - 29 * 1000, 'mini-minute-now')).to.equal('now')
		expect(timeAgo.format(Date.now() - 60 * 1000, 'mini-minute-now')).to.equal('1m')
		// "mini-minute".
		expect(timeAgo.format(Date.now() - 29 * 1000, 'mini-minute')).to.equal('0m')
		expect(timeAgo.format(Date.now() - 60 * 1000, 'mini-minute')).to.equal('1m')
		// "twitter".
		expect(timeAgo.format(Date.now() - 0 * 1000, 'twitter')).to.equal('0s')
		expect(timeAgo.format(Date.now() - 1 * 1000, 'twitter')).to.equal('1s')
		// "twitter-now".
		expect(timeAgo.format(Date.now() - 0 * 1000, 'twitter-now')).to.equal('now')
		expect(timeAgo.format(Date.now() - 1 * 1000, 'twitter-now')).to.equal('1s')
		// "twitter-minute-now".
		expect(timeAgo.format(Date.now() - 29 * 1000, 'twitter-minute-now')).to.equal('now')
		expect(timeAgo.format(Date.now() - 60 * 1000, 'twitter-minute-now')).to.equal('1m')
		// "twitter-minute".
		expect(timeAgo.format(Date.now() - 29 * 1000, 'twitter-minute')).to.equal('0m')
		expect(timeAgo.format(Date.now() - 60 * 1000, 'twitter-minute')).to.equal('1m')
		// "twitter-first-minute".
		expect(timeAgo.format(Date.now() - 29 * 1000, 'twitter-first-minute')).to.equal('')
		expect(timeAgo.format(Date.now() - 60 * 1000, 'twitter-first-minute')).to.equal('1m')
		// "approximate".
		expect(timeAgo.format(Date.now() - 45 * 1000, 'approximate')).to.equal('just now')
		// "convenient" style was renamed to "approximate".
		expect(timeAgo.format(Date.now() - 45 * 1000, 'convenient')).to.equal('just now')
		expect(timeAgo.format(Date.now() - 45 * 1000, 'round')).to.equal('45 seconds ago')
		// "default" style was renamed to "round".
		expect(timeAgo.format(Date.now() - 45 * 1000, 'default')).to.equal('45 seconds ago')
		expect(timeAgo.format(Date.now() - 29 * 1000, 'round-minute')).to.equal('just now')
		// "time" style was renamed to "approximate-time".
		expect(timeAgo.format(Date.now() - 2 * 60 * 1000, 'time')).to.equal('2 minutes')
		expect(timeAgo.format(Date.now() - 2 * 60 * 1000, 'approximate-time')).to.equal('2 minutes')
		expect(timeAgo.format(Date.now(), 'exotic')).to.equal('just now')
	})

	it('should accept empty constructor parameters', () => {
		const timeAgo = new TimeAgo()
		expect(timeAgo.format(new Date())).to.equal('just now')
	})

	it('should accept "mocked" Dates when testing', () => {
		const timeAgo = new TimeAgo('en')
		const mockedDate = { getTime: () => Date.now() }
		expect(timeAgo.format(mockedDate)).to.equal('just now')
	})

	it('should not accept anything but Dates and timestamps', () => {
		const timeAgo = new TimeAgo('en')
		const thrower = () => timeAgo.format('Jan 14, 2017')
		expect(thrower).to.throw('Unsupported relative time formatter input: string, Jan 14, 2017')
	})

	it('should return an empty string if the specified units are not available in locale data', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now(), { units: ['femtosecond'] })).to.equal('')
	})

	it('should format for a style with "custom" function', () => {
		const timeAgo = new TimeAgo('en')

		expect(timeAgo.format(Date.now(), {
			// `custom` returns a string
			custom({ now, time, date, locale }) {
				return locale
			}
		})
		).to.equal('en')

		expect(timeAgo.format(Date.now(), {
			// `custom` returns `undefined`
			custom({ now, time, date, locale }) {
				return
			}
		})
		).to.equal('just now')
	})

	it('should throw an error when formating for a style with "custom" function and `getTimeToNextUpdate: true` parameter is passed', () => {
		const timeAgo = new TimeAgo('en')

		expect(() => {
			timeAgo.format(Date.now(), {
				// `custom` returns a string.
				custom({ now, time, date, locale }) {
					return locale
				}
			}, {
				getTimeToNextUpdate: true
			})
		}).to.throw('not supported')
	})

	it('should format future dates', () => {
		expect(new TimeAgo('en').format(Date.now() + 60 * 60 * 1000)).to.equal('in 1 hour')
		expect(new TimeAgo('ru').format(Date.now() + 60 * 1000)).to.equal('через 1 минуту')
	})

	it('should accept "future" option', () => {
		// "now" unit.
		expect(new TimeAgo('en').format(Date.now())).to.equal('just now')
		expect(new TimeAgo('en').format(Date.now(), 'approximate', { future: true })).to.equal('in a moment')

		// Non-"now" unit, "long" style.
		// const style = {
		// 	gradation: [{
		// 		factor: 1,
		// 		unit: 'second'
		// 	}],
		// 	labels: 'long'
		// }
		// expect(new TimeAgo('en').format(Date.now(), style)).to.equal('0 seconds ago')
		// expect(new TimeAgo('en').format(Date.now(), style, { future: true })).to.equal('in 0 seconds')

		// Non-"now" unit, "mini" style.
		const style2 = {
			style: [{
				unit: 'year'
			}],
			labels: 'mini'
		}
		expect(new TimeAgo('ru').format(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000, style2)).to.equal('5 л')
		expect(new TimeAgo('ru').format(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000, style2, { future: true })).to.equal('5 л')
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
		expect(new TimeAgo('ru').format(Date.now() - 10 * 1000, style)).to.equal('2 г')
		expect(new TimeAgo('ru').format(Date.now() - 10 * 1000, style, { future: true })).to.equal('2 г')
	})

	it('should have generated missing quantifier functions for locales that do not have it in CLDR data', () => {
		expect(new TimeAgo('ccp').format(Date.now() + 60 * 1000)).to.include(' 𑄟𑄨𑄚𑄨𑄘𑄬')
	})

	it('should throw for non-existing locales', () => {
		expect(() => TimeAgo.addLocale()).to.throw('No locale data passed')
	})

	it('should choose "future" variant of a label for `0` if "future: true" option is passed', () => {
		TimeAgo.addLocale(english)
		const secondLabels = english['mini'].second
		english['mini'].second = {
			past: '{0} seconds ago',
			future: 'in {0} seconds'
		}

		expect(new TimeAgo('en').format(Date.now(), {
			steps: [{
				unit: 'second'
			}],
			// Uses "mini" labels so that it doesn't use `Intl.RelativeTimeFormat`.
			labels: 'mini'
		})).to.equal('0 seconds ago')

		expect(new TimeAgo('en').format(Date.now(), {
			steps: [{
				unit: 'second'
			}],
			// Uses "mini" labels so that it doesn't use `Intl.RelativeTimeFormat`.
			labels: 'mini'
		}, {
			future: true
		})).to.equal('in 0 seconds')

		english['mini'].second = secondLabels
	})

	it('should refresh the label when `refresh` parameter is passed', () => {
		let refreshedTimes = 0
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		const [text, cancelRefresh] = timeAgo.format(1000, 'twitter', {
			refresh: (text) => {
				if (refreshedTimes === 0) {
					expect(text).to.equal('0s')
				} else {
					throw new Error('Refresh should have been cancelled')
				}
				refreshedTimes++
			},
			now: 0,
			round: 'floor'
		})
		expect(text).to.equal('1s')
		expect(cancelRefresh).to.be.a('function')
		// Sidenote: `timeToNextUpdate` is `1`.
		const timeToNextUpdate = 1
		return delay(timeToNextUpdate + 1).then(() => {
			expect(refreshedTimes).to.equal(1)
			cancelRefresh()
		})
	})

	it('should get time to next update (capped)', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		expect(timeAgo.format(0.5 * 365 * 24 * 60 * 60 * 1000, 'twitter', {
			getTimeToNextUpdate: true,
			now: 0,
			round: 'floor'
		})).to.deep.equal([
			'Jul 2',
			2147483647
		])
	})

	it('should get time to next update (capped)', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		expect(timeAgo.format(0.5 * 365 * 24 * 60 * 60 * 1000, 'twitter', {
			getTimeToNextUpdate: true,
			getTimeToNextUpdateUncapped: true,
			now: 0,
			round: 'floor'
		})).to.deep.equal([
			'Jul 2',
			15681600001
		])
	})

	it('should get time to next update (uncapped)', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		expect(timeAgo.format(1000, 'twitter', {
			getTimeToNextUpdate: true,
			now: 0,
			round: 'floor'
		})).to.deep.equal([
			'1s',
			1
		])
	})

	it('should get time to next update (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		expect(timeAgo.format(1000, 'twitter', {
			getTimeToNextUpdate: true,
			now: 0,
			round: 'floor'
		})).to.deep.equal([
			'1s',
			1
		])
	})

	it('should get time to next update (round: "round")', () => {
		const timeAgo = new TimeAgo('en')
		// in 1 second -> in 0 seconds.
		expect(timeAgo.format(1000, 'twitter', {
			getTimeToNextUpdate: true,
			now: 0
		})).to.deep.equal([
			'1s',
			501
		])
	})

	it('should get time to next update ("mini-now" style) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		// In 1 minute.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 0,
			round: 'floor'
		})).to.deep.equal([
			'1m',
			1
		])
		// Almost in 1 minute.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 1,
			round: 'floor'
		})).to.deep.equal([
			'59s',
			1000
		])
		// In 1 second.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000,
			round: 'floor'
		})).to.deep.equal([
			'1s',
			1
		])
		// Almost in 1 second.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000 + 1,
			round: 'floor'
		})).to.deep.equal([
			'now',
			// Right after zero point.
			1000
		])
		// Zero point (future to past).
		// `future: true`.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			future: true,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1
		])
		// Zero point (future to past).
		// `future: false`.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1000
		])
		// Right after zero point (past).
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1000 - 1
		])
		// 1 second ago.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1000,
			round: 'floor'
		})).to.deep.equal([
			'1s',
			1000
		])
	})

	it('should get time to next update ("mini-now" style) (round: "round")', () => {
		const timeAgo = new TimeAgo('en')
		// In 1 minute.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 0
		})).to.deep.equal([
			'1m',
			500 + 1
		])
		// Almost in 1 minute.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 500 + 1
		})).to.deep.equal([
			'59s',
			1000
		])
		// In 1 second.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59.5 * 1000
		})).to.deep.equal([
			'1s',
			1
		])
		// Almost in 1 second.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59.5 * 1000 + 1
		})).to.deep.equal([
			'now',
			// Right after zero point.
			500
		])
		// Zero point (future to past).
		// `future: true`.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			future: true
		})).to.deep.equal([
			'now',
			1
		])
		// Zero point (future to past).
		// `future: false`.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000
		})).to.deep.equal([
			'now',
			500
		])
		// Right after zero point (past).
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1
		})).to.deep.equal([
			'now',
			500 - 1
		])
		// 1 second ago.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 500
		})).to.deep.equal([
			'1s',
			1000
		])
	})

	it('should get time to next update (first step has non-zero "minTime") (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		// Future.
		// Inside the first step.
		// Updates soon.
		expect(timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: -0.5 * 1000
		})).to.deep.equal([
			'1m',
			0.5 * 1000 + 1
		])

		// Future.
		// Outside of the first step.
		// Updates right after zero point.
		expect(timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60 * 1000
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: 1 * 1000
		})).to.deep.equal([
			'',
			59 * 1000 + 1
		])

		// Zero point.
		// Outside of the first step.
		// Updates at the first step's `minTime`.
		expect(timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: 60 * 1000
		})).to.deep.equal([
			'',
			60 * 1000
		])

		// Past.
		// Inside the first step.
		// Updates at the next minute.
		expect(timeAgo.format(60 * 1000, {
			steps: [{
				formatAs: 'minute',
				minTime: 60
			}],
			labels: 'mini',
			round: 'floor'
		}, {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 60 * 1000
		})).to.deep.equal([
			'1m',
			60 * 1000
		])

		// Almost in 1 minute.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 1,
			round: 'floor'
		})).to.deep.equal([
			'59s',
			1000
		])
		// In 1 second.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000,
			round: 'floor'
		})).to.deep.equal([
			'1s',
			1
		])
		// Almost in 1 second.
		// Updates right after the zero point.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 59 * 1000 + 1,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1000
		])
		// Zero point (future to past).
		// `future: true`.
		// Updates right after zero point.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			future: true,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1
		])
		// Zero point (future to past).
		// `future: false`.
		// Updates at the next second.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1000
		])
		// Right after zero point (past).
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1,
			round: 'floor'
		})).to.deep.equal([
			'now',
			1000 - 1
		])
		// 1 second ago.
		expect(timeAgo.format(60 * 1000, 'mini-now', {
			getTimeToNextUpdate: true,
			now: 60 * 1000 + 1000,
			round: 'floor'
		})).to.deep.equal([
			'1s',
			1000
		])
	})

	it('should pass `formatAs()` in `step.format()`', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(Date.now(), {
			labels: 'long',
			steps: [{
				format(date, locale, { formatAs }) {
					return formatAs('second', 1)
				}
			}]
		})).to.equal('in 1 second')
	})

	it('should support `polyfill: false` option', () => {
		const timeAgo = new TimeAgo('en', { polyfill: false })
		// Still uses "now" labels, even when not polyfilled.
		expect(timeAgo.format(0, 'round', { now: 0 })).to.equal('just now')
		expect(timeAgo.format(1000, 'round', { now: 0 })).to.equal('in 1 second')
	})

	it('should not use Intl.NumberFormat if it is not available', () => {
		const Intl = global.Intl
		global.Intl = undefined
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(1000, 'round', { now: 0 })).to.equal('in 1 second')
		global.Intl = Intl
	})

	it('should format `0` in past mode by default', () => {
		expect(new TimeAgo('en').format(0, {
			labels: 'long',
			steps: [{
				formatAs: 'second'
			}]
		}, { now: 0 })).to.equal('0 seconds ago')
	})

	it('should format `0` in future mode when `future: true` option was passed', () => {
		expect(new TimeAgo('en').format(0, {
			labels: 'long',
			steps: [{
				formatAs: 'second'
			}]
		}, { now: 0, future: true })).to.equal('in 0 seconds')
	})

	it('should throw if a step does not define `formatAs` or `format()`', () => {
		const timeAgo = new TimeAgo('en')
		expect(() => timeAgo.format(Date.now() + 1000, {
			labels: 'long',
			steps: [{}]
		})).to.throw('Each step must define either `formatAs` or `format()`.')
	})

	it('should add default locale', () => {
		expect(TimeAgo.getDefaultLocale()).to.equal('en')
		TimeAgo.addDefaultLocale({
			locale: 'el'
		})
		expect(TimeAgo.getDefaultLocale()).to.equal('el')
		// Doesn't throw an error because the same locale is already specified as default.
		TimeAgo.addDefaultLocale({
			locale: 'el'
		})
		// Could throw an error or output an error message because another locale is already specified as default.
		// expect(() => {
			TimeAgo.addDefaultLocale({
				locale: 'es'
			})
		// }).to.throw('but you have already added "el" as the default locale.')
		TimeAgo.setDefaultLocale('en')
	})

	it('should support "floor" rounding', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(0.9 * 1000, 'twitter', { now: 0, round: 'floor' })).to.equal('0s')
		expect(timeAgo.format(1 * 1000, 'twitter', { now: 0, round: 'floor' })).to.equal('1s')
		expect(timeAgo.format(1.9 * 1000, 'twitter', { now: 0, round: 'floor' })).to.equal('1s')
		expect(timeAgo.format(2 * 1000, 'twitter', { now: 0, round: 'floor' })).to.equal('2s')
		expect(timeAgo.format(1.9 * 60 * 1000, 'twitter', { now: 0, round: 'floor' })).to.equal('1m')
		expect(timeAgo.format(2 * 60 * 1000, 'twitter', { now: 0, round: 'floor' })).to.equal('2m')
	})
})

function delay(delayTime) {
	return new Promise((resolve) => {
		setTimeout(resolve, delayTime)
	})
}