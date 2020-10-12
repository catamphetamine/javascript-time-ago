import twitter from './twitterNow'
import TimeAgo from '../TimeAgo'
import { day, month, year } from '../steps'

describe('style/twitterNow', () => {
	it('should fallback from "mini-time" to "narrow"', () => {
		const timeAgo = new TimeAgo('it')
		timeAgo.format(Date.now() - 3 * 60 * 60 * 1000, 'twitter').should.equal('3 h fa')
	})

	it('should format Twitter style relative time (English)', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2016.
		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter })

		formatInterval(0).should.equal('now')
		formatInterval(0.5).should.equal('1s')
		formatInterval(59.4).should.equal('59s')
		formatInterval(59.6).should.equal('1m')
		formatInterval(1.49 * 60).should.equal('1m')
		formatInterval(1.51 * 60).should.equal('2m')
		formatInterval(2.49 * 60).should.equal('2m')
		formatInterval(2.51 * 60).should.equal('3m')
		// …
		formatInterval(59.49 * 60).should.equal('59m')
		formatInterval(59.51 * 60).should.equal('1h')
		formatInterval(1.49 * 60 * 60).should.equal('1h')
		formatInterval(1.51 * 60 * 60).should.equal('2h')
		formatInterval(2.49 * 60 * 60).should.equal('2h')
		formatInterval(2.51 * 60 * 60).should.equal('3h')
		// …
		formatInterval(23.49 * 60 * 60).should.equal('23h')
		formatInterval(day + 2 * 60 + 60 * 60).should.equal('Apr 9')
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

		formatInterval(0).should.equal('сейчас')
		formatInterval(0.5).should.equal('1 с')
		formatInterval(59.51).should.equal('1 мин')
		formatInterval(59.51 * 60).should.equal('1 ч')
		formatInterval(day + 62 * 60).should.equal('9 апр.')
		formatInterval(year).should.equal('11 апр. 2015 г.')
	})
})