import roundMinute from './roundMinute'
import JavascriptTimeAgo from '../JavascriptTimeAgo'
import { day, month, year } from '../gradation'

describe('style/round-minute', () => {
	it('should format relative time (English)', () => {
		const timeAgo = new JavascriptTimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const elapsed = (time) => timeAgo.format(now - time * 1000, { now, ...roundMinute })

		elapsed(0).should.equal('just now')
		elapsed(59.4).should.equal('just now')
		elapsed(59.6).should.equal('1 minute ago')
		elapsed(1.49 * 60).should.equal('1 minute ago')
		elapsed(1.51 * 60).should.equal('2 minutes ago')
		elapsed(2.49 * 60).should.equal('2 minutes ago')
		elapsed(2.51 * 60).should.equal('3 minutes ago')
		// …
		elapsed(59.49 * 60).should.equal('59 minutes ago')
		elapsed(59.51 * 60).should.equal('1 hour ago')
		elapsed(1.49 * 60 * 60).should.equal('1 hour ago')
		elapsed(1.51 * 60 * 60).should.equal('2 hours ago')
		elapsed(2.49 * 60 * 60).should.equal('2 hours ago')
		elapsed(2.51 * 60 * 60).should.equal('3 hours ago')
		// …
		elapsed(23.49 * 60 * 60).should.equal('23 hours ago')
		elapsed(23.51 * 60 * 60).should.equal('1 day ago')
		elapsed(1.49 * day).should.equal('1 day ago')
		elapsed(1.51 * day).should.equal('2 days ago')
		elapsed(2.49 * day).should.equal('2 days ago')
		elapsed(2.51 * day).should.equal('3 days ago')
		// …
		elapsed(6.49 * day).should.equal('6 days ago')
		elapsed(6.51 * day).should.equal('1 week ago')
		// …
		elapsed(3.49 * 7 * day).should.equal('3 weeks ago')
		elapsed(30.51 * day).should.equal('1 month ago')
		elapsed(1.49 * month).should.equal('1 month ago')
		elapsed(1.51 * month).should.equal('2 months ago')
		elapsed(2.49 * month).should.equal('2 months ago')
		elapsed(2.51 * month).should.equal('3 months ago')
		// …
		elapsed(11.49 * month).should.equal('11 months ago')
		elapsed(11.51 * month).should.equal('1 year ago')
		elapsed(1.49 * year).should.equal('1 year ago')
		elapsed(1.51 * year).should.equal('2 years ago')
		// …

		// Test future dates.
		elapsed(-1 * 3 * 60).should.equal('in 3 minutes')
		elapsed(-1 * month * 8).should.equal('in 8 months')
	})
})