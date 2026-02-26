import { describe, it } from 'mocha'
import { expect } from 'chai'

import twitter from './twitter.js'
import TimeAgo from '../TimeAgo.js'
import { hour, minute, day, month, year } from '../steps/index.js'

describe('style/twitter', () => {
	it('should fallback from "mini" to "narrow"', () => {
		const timeAgo = new TimeAgo('ccp')
		expect(timeAgo.format(Date.now() - 3 * hour * 1000, 'twitter')).to.include(' 𑄊𑄮𑄚𑄴𑄓 𑄃𑄉𑄬')
	})

	it('should format Twitter style relative time (English) (round: "round")', () => {
		const timeAgo = new TimeAgo('en')

		const formatDatePastBy = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...twitter })

		expect(formatDatePastBy(0.49)).to.equal('0s')
		expect(formatDatePastBy(0.5)).to.equal('1s')
		expect(formatDatePastBy(59.49)).to.equal('59s')
		expect(formatDatePastBy(59.5)).to.equal('1m')
		expect(formatDatePastBy(1.49 * minute)).to.equal('1m')
		expect(formatDatePastBy(1.5 * minute)).to.equal('2m')
		// …
		expect(formatDatePastBy(59.49 * minute)).to.equal('59m')
		expect(formatDatePastBy(59.5 * minute)).to.equal('1h')
		expect(formatDatePastBy(1.49 * hour)).to.equal('1h')
		expect(formatDatePastBy(1.5 * hour)).to.equal('2h')
		// …
		expect(formatDatePastBy(23.49 * hour)).to.equal('23h')
	})

	it('should format Twitter style relative time (English) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		const formatDatePastBy = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...twitter, round: 'floor' })

		expect(formatDatePastBy(0)).to.equal('0s')
		expect(formatDatePastBy(0.9)).to.equal('0s')
		expect(formatDatePastBy(1)).to.equal('1s')
		expect(formatDatePastBy(59.9)).to.equal('59s')
		expect(formatDatePastBy(60)).to.equal('1m')
		expect(formatDatePastBy(1.9 * minute)).to.equal('1m')
		expect(formatDatePastBy(2 * minute)).to.equal('2m')
		expect(formatDatePastBy(2.9 * minute)).to.equal('2m')
		expect(formatDatePastBy(3 * minute)).to.equal('3m')
		// …
		expect(formatDatePastBy(59.9 * minute)).to.equal('59m')
		expect(formatDatePastBy(60 * minute)).to.equal('1h')
		expect(formatDatePastBy(1.9 * hour)).to.equal('1h')
		expect(formatDatePastBy(2 * hour)).to.equal('2h')
		expect(formatDatePastBy(2.9 * hour)).to.equal('2h')
		expect(formatDatePastBy(3 * hour)).to.equal('3h')
		// …
		expect(formatDatePastBy(23.9 * hour)).to.equal('23h')
	})

	it('should format Twitter style relative time (English) (absolute dates)', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2016, 12:00.
		const now = new Date(2016, 3, 10, 12, 0).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		expect(formatDatePastBy(day + 2 * minute + hour)).to.equal('Apr 9')
		// …
		// `month` is about 30.5 days.
		expect(formatDatePastBy(month * 3)).to.equal('Jan 10')
		expect(formatDatePastBy(month * 4)).to.equal('Dec 10, 2015')
		expect(formatDatePastBy(year)).to.equal('Apr 11, 2015')

		// Test future dates.
		// `month` is about 30.5 days.
		expect(formatDatePastBy(-1 * month * 8)).to.equal('Dec 10')
		expect(formatDatePastBy(-1 * month * 9)).to.equal('Jan 9, 2017')
	})

	it('should format Twitter style relative time (Russian)', () => {
		const timeAgo = new TimeAgo('ru')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		expect(formatDatePastBy(0)).to.equal('0 с')
		expect(formatDatePastBy(1)).to.equal('1 с')
		expect(formatDatePastBy(minute)).to.equal('1 мин')
		expect(formatDatePastBy(hour)).to.equal('1 ч')
		expect(formatDatePastBy(day + 62 * minute)).to.equal('9 апр.')
		expect(formatDatePastBy(year)).to.equal('11 апр. 2015 г.')
	})

	it('should format Twitter style relative time (Korean)', () => {
		const timeAgo = new TimeAgo('ko')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		expect(formatDatePastBy(minute)).to.equal('1분')
		expect(formatDatePastBy(hour)).to.equal('1시간')
		expect(formatDatePastBy(day + 62 * minute)).to.equal('4월 9일')
		expect(formatDatePastBy(year)).to.equal('2015년 4월 11일')
	})

	it('should format Twitter style relative time (German)', () => {
		const timeAgo = new TimeAgo('de')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		expect(formatDatePastBy(minute)).to.equal('1 Min.')
		expect(formatDatePastBy(hour)).to.equal('1 Std.')
		expect(formatDatePastBy(day + 62 * minute)).to.equal('9. Apr.')
		expect(formatDatePastBy(year)).to.equal('11. Apr. 2015')
	})

	it('should format Twitter style relative time (French)', () => {
		const timeAgo = new TimeAgo('fr')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		expect(formatDatePastBy(minute)).to.equal('1 min.')
		expect(formatDatePastBy(hour)).to.equal('1 h')
		expect(formatDatePastBy(day + 62 * minute)).to.equal('9 avr.')
		expect(formatDatePastBy(year)).to.equal('11 avr. 2015')
	})

	it('should format Twitter style relative time (Chinese)', () => {
		const timeAgo = new TimeAgo('zh')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		expect(formatDatePastBy(minute)).to.equal('1分钟')
		expect(formatDatePastBy(hour)).to.equal('1小时')
		expect(formatDatePastBy(day + 62 * minute)).to.equal('4月9日')
		expect(formatDatePastBy(year)).to.equal('2015年4月11日')
	})

	// This test won't pass because `Intl.DateTimeFormat` is read at
	// initialization time, not at run time.
	// it('should fall back to generic style when Intl.DateTimeFormat is not available', () => {
	// 	const DateTimeFormat = Intl.DateTimeFormat
	// 	Intl.DateTimeFormat = undefined
	//
	// 	const timeAgo = new TimeAgo('en')
	// 	expect(timeAgo.format(Date.now() - 365 * 24 * hour * 1000, 'twitter')).to.equal('1yr')
	//
	// 	Intl.DateTimeFormat = DateTimeFormat
	// })

	it('should support timestamp argument on `yearMonthAndDay.test()`', () => {
		const timeAgo = new TimeAgo('en')
		expect(timeAgo.format(0, 'twitter')).to.equal('Jan 1, 1970')
	})

	it('should round as "floor"', () => {
		const timeAgo = new TimeAgo('en')
		const test = (time, result) => {
			expect(timeAgo.format(time, 'twitter', {
				round: 'floor',
				now: 0
			})).to.equal(result)
		}
		test(2001, '2s')
		test(2000, '2s')
		test(1999, '1s')
		test(1001, '1s')
		test(1000, '1s')
		test(999, '0s')
		test(0, '0s')
		test(-999, '0s')
		test(-1000, '1s')
		test(-1001, '1s')
		test(-1999, '1s')
		test(-2000, '2s')
		test(-2001, '2s')
	})

	it('should get time to next update (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2018, 12:00.
		const date = new Date(2018, 3, 10, 12, 0)

		// April 10th, 2016, 12:00 (two years earlier).
		let now = new Date(2016, 3, 10, 12, 0).getTime()

		expect(timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true,
				getTimeToNextUpdateUncapped: true
			}
		)).to.deep.equal([
			'Apr 10, 2018',
			// Updates on Jan 1st, 2018, 00:00.
			new Date(2018, 0, 1).getTime() - now
		])

		// 1st, 2018, 00:00.
		now = new Date(2018, 0, 1).getTime()

		expect(timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true,
				getTimeToNextUpdateUncapped: true,
				round: 'floor'
			}
		)).to.deep.equal([
			'Apr 10',
			// Updates after April 9th, 2018, 12:00.
			(new Date(2018, 3, 9, 12, 0).getTime() + 1) - now
		])

		// After April 9th, 2018, 12:00.
		now = new Date(2018, 3, 9, 12, 0).getTime() + 1

		expect(timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true,
				round: 'floor'
			}
		)).to.deep.equal([
			'23h',
			// Updates in an hour.
			60 * 60 * 1000
		])
	})

	it('should get time to next update (round: "round")', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2018, 12:00.
		const date = new Date(2018, 3, 10, 12, 0)

		let now

		// 1st, 2018, 00:00.
		now = new Date(2018, 0, 1).getTime()

		expect(timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true,
				getTimeToNextUpdateUncapped: true
			}
		)).to.deep.equal([
			'Apr 10',
			// Updates after April 9th, 2018, 11:30.
			(new Date(2018, 3, 9, 12, 0).getTime() + 30 * 60 * 1000 + 1) - now
		])

		// After April 9th, 2018, 12:00.
		now = new Date(2018, 3, 9, 12, 0).getTime() + 30 * 60 * 1000 + 1

		expect(timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true
			}
		)).to.deep.equal([
			'23h',
			// Updates in an hour.
			60 * 60 * 1000
		])
	})
})