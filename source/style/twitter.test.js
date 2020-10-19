import twitter from './twitter'
import TimeAgo from '../TimeAgo'
import { hour, minute, day, month, year } from '../steps'

describe('style/twitter', () => {
	it('should fallback from "mini" to "narrow"', () => {
		const timeAgo = new TimeAgo('it')
		timeAgo.format(Date.now() - 3 * hour * 1000, 'twitter').should.equal('3 h fa')
	})

	it('should format Twitter style relative time (English) (round: "round")', () => {
		const timeAgo = new TimeAgo('en')

		const formatDatePastBy = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...twitter })

		formatDatePastBy(0.49).should.equal('0s')
		formatDatePastBy(0.5).should.equal('1s')
		formatDatePastBy(59.49).should.equal('59s')
		formatDatePastBy(59.5).should.equal('1m')
		formatDatePastBy(1.49 * minute).should.equal('1m')
		formatDatePastBy(1.5 * minute).should.equal('2m')
		// …
		formatDatePastBy(59.49 * minute).should.equal('59m')
		formatDatePastBy(59.5 * minute).should.equal('1h')
		formatDatePastBy(1.49 * hour).should.equal('1h')
		formatDatePastBy(1.5 * hour).should.equal('2h')
		// …
		formatDatePastBy(23.49 * hour).should.equal('23h')
	})

	it('should format Twitter style relative time (English) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		const formatDatePastBy = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...twitter, round: 'floor' })

		formatDatePastBy(0).should.equal('0s')
		formatDatePastBy(0.9).should.equal('0s')
		formatDatePastBy(1).should.equal('1s')
		formatDatePastBy(59.9).should.equal('59s')
		formatDatePastBy(60).should.equal('1m')
		formatDatePastBy(1.9 * minute).should.equal('1m')
		formatDatePastBy(2 * minute).should.equal('2m')
		formatDatePastBy(2.9 * minute).should.equal('2m')
		formatDatePastBy(3 * minute).should.equal('3m')
		// …
		formatDatePastBy(59.9 * minute).should.equal('59m')
		formatDatePastBy(60 * minute).should.equal('1h')
		formatDatePastBy(1.9 * hour).should.equal('1h')
		formatDatePastBy(2 * hour).should.equal('2h')
		formatDatePastBy(2.9 * hour).should.equal('2h')
		formatDatePastBy(3 * hour).should.equal('3h')
		// …
		formatDatePastBy(23.9 * hour).should.equal('23h')
	})

	it('should format Twitter style relative time (English) (absolute dates)', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2016, 12:00.
		const now = new Date(2016, 3, 10, 12, 0).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatDatePastBy(day + 2 * minute + hour).should.equal('Apr 9')
		// …
		// `month` is about 30.5 days.
		formatDatePastBy(month * 3).should.equal('Jan 10')
		formatDatePastBy(month * 4).should.equal('Dec 10, 2015')
		formatDatePastBy(year).should.equal('Apr 11, 2015')

		// Test future dates.
		// `month` is about 30.5 days.
		formatDatePastBy(-1 * month * 8).should.equal('Dec 10')
		formatDatePastBy(-1 * month * 9).should.equal('Jan 9, 2017')
	})

	it('should format Twitter style relative time (Russian)', () => {
		const timeAgo = new TimeAgo('ru')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatDatePastBy(0).should.equal('0 с')
		formatDatePastBy(1).should.equal('1 с')
		formatDatePastBy(minute).should.equal('1 мин')
		formatDatePastBy(hour).should.equal('1 ч')
		formatDatePastBy(day + 62 * minute).should.equal('9 апр.')
		formatDatePastBy(year).should.equal('11 апр. 2015 г.')
	})

	it('should format Twitter style relative time (Korean)', () => {
		const timeAgo = new TimeAgo('ko')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatDatePastBy(minute).should.equal('1분')
		formatDatePastBy(hour).should.equal('1시간')
		formatDatePastBy(day + 62 * minute).should.equal('4월 9일')
		formatDatePastBy(year).should.equal('2015년 4월 11일')
	})

	it('should format Twitter style relative time (German)', () => {
		const timeAgo = new TimeAgo('de')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatDatePastBy(minute).should.equal('1 Min.')
		formatDatePastBy(hour).should.equal('1 Std.')
		formatDatePastBy(day + 62 * minute).should.equal('9. Apr.')
		formatDatePastBy(year).should.equal('11. Apr. 2015')
	})

	it('should format Twitter style relative time (French)', () => {
		const timeAgo = new TimeAgo('fr')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatDatePastBy(minute).should.equal('1 min')
		formatDatePastBy(hour).should.equal('1 h')
		formatDatePastBy(day + 62 * minute).should.equal('9 avr.')
		formatDatePastBy(year).should.equal('11 avr. 2015')
	})

	it('should format Twitter style relative time (Chinese)', () => {
		const timeAgo = new TimeAgo('zh')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatDatePastBy = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatDatePastBy(minute).should.equal('1分钟')
		formatDatePastBy(hour).should.equal('1小时')
		formatDatePastBy(day + 62 * minute).should.equal('4月9日')
		formatDatePastBy(year).should.equal('2015年4月11日')
	})

	// This test won't pass because `Intl.DateTimeFormat` is read at
	// initialization time, not at run time.
	// it('should fall back to generic style when Intl.DateTimeFormat is not available', () => {
	// 	const DateTimeFormat = Intl.DateTimeFormat
	// 	Intl.DateTimeFormat = undefined
	//
	// 	const timeAgo = new TimeAgo('en')
	// 	timeAgo.format(Date.now() - 365 * 24 * hour * 1000, 'twitter').should.equal('1yr')
	//
	// 	Intl.DateTimeFormat = DateTimeFormat
	// })

	it('should support timestamp argument on `yearMonthAndDay.test()`', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(0, 'twitter').should.equal('Jan 1, 1970')
	})

	it('should round as "floor"', () => {
		const timeAgo = new TimeAgo('en')
		const test = (time, result) => timeAgo.format(time, 'twitter', {
			round: 'floor',
			now: 0
		}).should.equal(result)
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

		timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true
			}
		).should.deep.equal([
			'Apr 10, 2018',
			// Updates on Jan 1st, 2018, 00:00.
			new Date(2018, 0, 1).getTime() - now
		])

		// 1st, 2018, 00:00.
		now = new Date(2018, 0, 1).getTime()

		timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true,
				round: 'floor'
			}
		).should.deep.equal([
			'Apr 10',
			// Updates after April 9th, 2018, 12:00.
			(new Date(2018, 3, 9, 12, 0).getTime() + 1) - now
		])

		// After April 9th, 2018, 12:00.
		now = new Date(2018, 3, 9, 12, 0).getTime() + 1

		timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true,
				round: 'floor'
			}
		).should.deep.equal([
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

		timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true
			}
		).should.deep.equal([
			'Apr 10',
			// Updates after April 9th, 2018, 11:30.
			(new Date(2018, 3, 9, 12, 0).getTime() + 30 * 60 * 1000 + 1) - now
		])

		// After April 9th, 2018, 12:00.
		now = new Date(2018, 3, 9, 12, 0).getTime() + 30 * 60 * 1000 + 1

		timeAgo.format(
			date,
			'twitter',
			{
				now,
				getTimeToNextUpdate: true
			}
		).should.deep.equal([
			'23h',
			// Updates in an hour.
			60 * 60 * 1000
		])
	})
})