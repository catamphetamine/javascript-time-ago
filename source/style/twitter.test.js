import twitter from './twitter'
import TimeAgo from '../TimeAgo'
import { hour, minute, day, month, year } from '../steps'

describe('style/twitter', () => {
	it('should fallback from "mini-time" to "narrow"', () => {
		const timeAgo = new TimeAgo('it')
		timeAgo.format(Date.now() - 3 * hour * 1000, 'twitter').should.equal('3 h fa')
	})

	it('should format Twitter style relative time (English)', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2016.
		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(0).should.equal('0s')
		formatInterval(0.5).should.equal('1s')
		formatInterval(59.4).should.equal('59s')
		formatInterval(59.6).should.equal('1m')
		formatInterval(1.49 * minute).should.equal('1m')
		formatInterval(1.51 * minute).should.equal('2m')
		formatInterval(2.49 * minute).should.equal('2m')
		formatInterval(2.51 * minute).should.equal('3m')
		// …
		formatInterval(59.49 * minute).should.equal('59m')
		formatInterval(59.51 * minute).should.equal('1h')
		formatInterval(1.49 * hour).should.equal('1h')
		formatInterval(1.51 * hour).should.equal('2h')
		formatInterval(2.49 * hour).should.equal('2h')
		formatInterval(2.51 * hour).should.equal('3h')
		// …
		formatInterval(23.49 * hour).should.equal('23h')
		formatInterval(day + 2 * minute + hour).should.equal('Apr 9')
		// …
		// `month` is about 30.5 days.
		formatInterval(month * 3).should.equal('Jan 10')
		formatInterval(month * 4).should.equal('Dec 11, 2015')
		formatInterval(year).should.equal('Apr 11, 2015')

		// Test future dates.
		// `month` is about 30.5 days.
		formatInterval(-1 * month * 8).should.equal('Dec 10')
		formatInterval(-1 * month * 9).should.equal('Jan 9, 2017')
	})

	it('should format Twitter style relative time (Russian)', () => {
		const timeAgo = new TimeAgo('ru')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(0).should.equal('0 с')
		formatInterval(0.5).should.equal('1 с')
		formatInterval(59.51).should.equal('1 мин')
		formatInterval(59.51 * minute).should.equal('1 ч')
		formatInterval(day + 62 * minute).should.equal('9 апр.')
		formatInterval(year).should.equal('11 апр. 2015 г.')
	})

	it('should format Twitter style relative time (Korean)', () => {
		const timeAgo = new TimeAgo('ko')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(59.51).should.equal('1분')
		formatInterval(59.51 * minute).should.equal('1시간')
		formatInterval(day + 62 * minute).should.equal('4월 9일')
		formatInterval(year).should.equal('2015년 4월 11일')
	})

	it('should format Twitter style relative time (German)', () => {
		const timeAgo = new TimeAgo('de')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(59.51).should.equal('1 Min.')
		formatInterval(59.51 * minute).should.equal('1 Std.')
		formatInterval(day + 62 * minute).should.equal('9. Apr.')
		formatInterval(year).should.equal('11. Apr. 2015')
	})

	it('should format Twitter style relative time (French)', () => {
		const timeAgo = new TimeAgo('fr')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(59.51).should.equal('1 min')
		formatInterval(59.51 * minute).should.equal('1 h')
		formatInterval(day + 62 * minute).should.equal('9 avr.')
		formatInterval(year).should.equal('11 avr. 2015')
	})

	it('should format Twitter style relative time (Chinese)', () => {
		const timeAgo = new TimeAgo('zh')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(59.51).should.equal('1分钟')
		formatInterval(59.51 * minute).should.equal('1小时')
		formatInterval(day + 62 * minute).should.equal('4月9日')
		formatInterval(year).should.equal('2015年4月11日')
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

	it('should return time to next update', () => {
		const timeAgo = new TimeAgo('en')
		const now = new Date(2016, 3, 10, 22, 59).getTime()
		timeAgo.format(now + day * 1000, 'twitter', { now, getTimeToNextUpdate: true }).should.deep.equal([
			'Apr 11',
			22899660000 // The next update is in about 265 days.
		])
		timeAgo.format(0, 'twitter', { getTimeToNextUpdate: true }).should.deep.equal([
			'Jan 1, 1970',
			1000 * year // The next update is practically "never".
		])
	})
})