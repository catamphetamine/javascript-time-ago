import twitter from './twitterFirstMinute'
import TimeAgo from '../TimeAgo'
import { hour, minute, day, month, year } from '../steps'

describe('style/twitterFirstMinute', () => {
	it('should work with string name of the style', () => {
		const timeAgo = new TimeAgo('en')
		timeAgo.format(Date.now() - 3 * 60 * 60 * 1000, 'twitter-first-minute').should.equal('3h')
	})

	it('should format Twitter style relative time (English) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter, round: 'floor' })

		formatInterval(0).should.equal('')
		formatInterval(0.9).should.equal('')
		formatInterval(59.9).should.equal('')
		formatInterval(60).should.equal('1m')
		formatInterval(1.9 * minute).should.equal('1m')
		formatInterval(2 * minute).should.equal('2m')
		formatInterval(2.9 * minute).should.equal('2m')
		formatInterval(3 * minute).should.equal('3m')
		// …
		formatInterval(59.9 * minute).should.equal('59m')
		formatInterval(60 * minute).should.equal('1h')
		formatInterval(1.9 * hour).should.equal('1h')
		formatInterval(2 * hour).should.equal('2h')
		formatInterval(2.9 * hour).should.equal('2h')
		formatInterval(3 * hour).should.equal('3h')
		// …
		formatInterval(23.9 * hour).should.equal('23h')
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

	it('should format Twitter style relative time (English) (round: "round")', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter, round: 'round' })

		formatInterval(0).should.equal('')
		formatInterval(59.9).should.equal('')
		formatInterval(60).should.equal('1m')
		formatInterval(1.49 * minute).should.equal('1m')
		formatInterval(1.5 * minute).should.equal('2m')
	})
})