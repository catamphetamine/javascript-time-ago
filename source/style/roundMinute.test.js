import { describe, it } from 'mocha'
import { expect } from 'chai'

import roundMinute from './roundMinute.js'
import TimeAgo from '../TimeAgo.js'
import { day, month, year } from '../steps/index.js'

describe('style/round-minute', () => {
	it('should format relative time (English) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...roundMinute, round: 'floor' })

		expect(formatInterval(0)).to.equal('just now')
		expect(formatInterval(0.9)).to.equal('just now')
		expect(formatInterval(1)).to.equal('just now')
		expect(formatInterval(59.9)).to.equal('just now')
		expect(formatInterval(60)).to.equal('1 minute ago')
		expect(formatInterval(1.9 * 60)).to.equal('1 minute ago')
		expect(formatInterval(2 * 60)).to.equal('2 minutes ago')
		expect(formatInterval(2.9 * 60)).to.equal('2 minutes ago')
		expect(formatInterval(3 * 60)).to.equal('3 minutes ago')
		// …
		expect(formatInterval(59.9 * 60)).to.equal('59 minutes ago')
		expect(formatInterval(60 * 60)).to.equal('1 hour ago')
		expect(formatInterval(1.9 * 60 * 60)).to.equal('1 hour ago')
		expect(formatInterval(2 * 60 * 60)).to.equal('2 hours ago')
		expect(formatInterval(2.9 * 60 * 60)).to.equal('2 hours ago')
		expect(formatInterval(3 * 60 * 60)).to.equal('3 hours ago')
		// …
		expect(formatInterval(23.9 * 60 * 60)).to.equal('23 hours ago')
		expect(formatInterval(24 * 60 * 60)).to.equal('1 day ago')
		expect(formatInterval(1.9 * day)).to.equal('1 day ago')
		expect(formatInterval(2 * day)).to.equal('2 days ago')
		expect(formatInterval(2.9 * day)).to.equal('2 days ago')
		expect(formatInterval(3 * day)).to.equal('3 days ago')
		// …
		expect(formatInterval(6.9 * day)).to.equal('6 days ago')
		expect(formatInterval(7 * day)).to.equal('1 week ago')
		// …
		expect(formatInterval(3.9 * 7 * day)).to.equal('3 weeks ago')
		expect(formatInterval(4 * 7 * day)).to.equal('4 weeks ago')
		expect(formatInterval(30.51 * day)).to.equal('1 month ago')
		expect(formatInterval(1.9 * month)).to.equal('1 month ago')
		expect(formatInterval(2 * month)).to.equal('2 months ago')
		expect(formatInterval(2.9 * month)).to.equal('2 months ago')
		expect(formatInterval(3 * month)).to.equal('3 months ago')
		// …
		expect(formatInterval(11.9 * month)).to.equal('11 months ago')
		expect(formatInterval(12 * month)).to.equal('1 year ago')
		expect(formatInterval(1.99 * year)).to.equal('1 year ago')
		expect(formatInterval(2 * year)).to.equal('2 years ago')
		// …

		// Test future dates.
		expect(formatInterval(-1 * 3 * 60)).to.equal('in 3 minutes')
		expect(formatInterval(-1 * month * 8)).to.equal('in 8 months')
	})

	it('should format relative time (English)', () => {
		const timeAgo = new TimeAgo('en')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...roundMinute })

		expect(formatInterval(0)).to.equal('just now')
		expect(formatInterval(0.49)).to.equal('just now')
		expect(formatInterval(0.5)).to.equal('just now')
		expect(formatInterval(29.9)).to.equal('just now')
		expect(formatInterval(30)).to.equal('1 minute ago')
		expect(formatInterval(1.49 * 60)).to.equal('1 minute ago')
		expect(formatInterval(1.5 * 60)).to.equal('2 minutes ago')
		expect(formatInterval(2.49 * 60)).to.equal('2 minutes ago')
		expect(formatInterval(2.5 * 60)).to.equal('3 minutes ago')
	})
})