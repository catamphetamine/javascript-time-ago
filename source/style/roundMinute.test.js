import roundMinute from './roundMinute'
import TimeAgo from '../TimeAgo'
import { day, month, year } from '../steps'

describe('style/round-minute', () => {
	it('should format relative time (English)', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...roundMinute })

		formatInterval(0).should.equal('just now')
		formatInterval(39.9).should.equal('just now')
		formatInterval(40).should.equal('1 minute ago')
		formatInterval(1.49 * 60).should.equal('1 minute ago')
		formatInterval(1.51 * 60).should.equal('2 minutes ago')
		formatInterval(2.49 * 60).should.equal('2 minutes ago')
		formatInterval(2.51 * 60).should.equal('3 minutes ago')
		// …
		formatInterval(59.49 * 60).should.equal('59 minutes ago')
		formatInterval(59.51 * 60).should.equal('1 hour ago')
		formatInterval(1.49 * 60 * 60).should.equal('1 hour ago')
		formatInterval(1.51 * 60 * 60).should.equal('2 hours ago')
		formatInterval(2.49 * 60 * 60).should.equal('2 hours ago')
		formatInterval(2.51 * 60 * 60).should.equal('3 hours ago')
		// …
		formatInterval(23.49 * 60 * 60).should.equal('23 hours ago')
		formatInterval(23.51 * 60 * 60).should.equal('1 day ago')
		formatInterval(1.49 * day).should.equal('1 day ago')
		formatInterval(1.51 * day).should.equal('2 days ago')
		formatInterval(2.49 * day).should.equal('2 days ago')
		formatInterval(2.51 * day).should.equal('3 days ago')
		// …
		formatInterval(6.49 * day).should.equal('6 days ago')
		formatInterval(6.51 * day).should.equal('1 week ago')
		// …
		formatInterval(3.49 * 7 * day).should.equal('3 weeks ago')
		formatInterval(30.51 * day).should.equal('1 month ago')
		formatInterval(1.49 * month).should.equal('1 month ago')
		formatInterval(1.51 * month).should.equal('2 months ago')
		formatInterval(2.49 * month).should.equal('2 months ago')
		formatInterval(2.51 * month).should.equal('3 months ago')
		// …
		formatInterval(11.49 * month).should.equal('11 months ago')
		formatInterval(11.51 * month).should.equal('1 year ago')
		formatInterval(1.49 * year).should.equal('1 year ago')
		formatInterval(1.51 * year).should.equal('2 years ago')
		// …

		// Test future dates.
		formatInterval(-1 * 3 * 60).should.equal('in 3 minutes')
		formatInterval(-1 * month * 8).should.equal('in 8 months')
	})
})