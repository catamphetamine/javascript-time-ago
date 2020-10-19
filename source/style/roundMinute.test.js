import roundMinute from './roundMinute'
import TimeAgo from '../TimeAgo'
import { day, month, year } from '../steps'

describe('style/round-minute', () => {
	it('should format relative time (English) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...roundMinute, round: 'floor' })

		formatInterval(0).should.equal('just now')
		formatInterval(0.9).should.equal('just now')
		formatInterval(1).should.equal('just now')
		formatInterval(59.9).should.equal('just now')
		formatInterval(60).should.equal('1 minute ago')
		formatInterval(1.9 * 60).should.equal('1 minute ago')
		formatInterval(2 * 60).should.equal('2 minutes ago')
		formatInterval(2.9 * 60).should.equal('2 minutes ago')
		formatInterval(3 * 60).should.equal('3 minutes ago')
		// …
		formatInterval(59.9 * 60).should.equal('59 minutes ago')
		formatInterval(60 * 60).should.equal('1 hour ago')
		formatInterval(1.9 * 60 * 60).should.equal('1 hour ago')
		formatInterval(2 * 60 * 60).should.equal('2 hours ago')
		formatInterval(2.9 * 60 * 60).should.equal('2 hours ago')
		formatInterval(3 * 60 * 60).should.equal('3 hours ago')
		// …
		formatInterval(23.9 * 60 * 60).should.equal('23 hours ago')
		formatInterval(24 * 60 * 60).should.equal('1 day ago')
		formatInterval(1.9 * day).should.equal('1 day ago')
		formatInterval(2 * day).should.equal('2 days ago')
		formatInterval(2.9 * day).should.equal('2 days ago')
		formatInterval(3 * day).should.equal('3 days ago')
		// …
		formatInterval(6.9 * day).should.equal('6 days ago')
		formatInterval(7 * day).should.equal('1 week ago')
		// …
		formatInterval(3.9 * 7 * day).should.equal('3 weeks ago')
		formatInterval(4 * 7 * day).should.equal('4 weeks ago')
		formatInterval(30.51 * day).should.equal('1 month ago')
		formatInterval(1.9 * month).should.equal('1 month ago')
		formatInterval(2 * month).should.equal('2 months ago')
		formatInterval(2.9 * month).should.equal('2 months ago')
		formatInterval(3 * month).should.equal('3 months ago')
		// …
		formatInterval(11.9 * month).should.equal('11 months ago')
		formatInterval(12 * month).should.equal('1 year ago')
		formatInterval(1.99 * year).should.equal('1 year ago')
		formatInterval(2 * year).should.equal('2 years ago')
		// …

		// Test future dates.
		formatInterval(-1 * 3 * 60).should.equal('in 3 minutes')
		formatInterval(-1 * month * 8).should.equal('in 8 months')
	})

	it('should format relative time (English)', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...roundMinute })

		formatInterval(0).should.equal('just now')
		formatInterval(0.49).should.equal('just now')
		formatInterval(0.5).should.equal('just now')
		formatInterval(29.9).should.equal('just now')
		formatInterval(30).should.equal('1 minute ago')
		formatInterval(1.49 * 60).should.equal('1 minute ago')
		formatInterval(1.5 * 60).should.equal('2 minutes ago')
		formatInterval(2.49 * 60).should.equal('2 minutes ago')
		formatInterval(2.5 * 60).should.equal('3 minutes ago')
	})
})