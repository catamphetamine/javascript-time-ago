import { describe, it } from 'mocha'
import { expect } from 'chai'

import twitter from './twitterNow.js'
import TimeAgo from '../TimeAgo.js'
import { hour, minute, day, month, year } from '../steps/index.js'

describe('style/twitterNow', () => {
	it('should format Twitter style relative time (English) (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')

		// April 10th, 2016.
		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter, round: 'floor' })

		expect(formatInterval(0)).to.equal('now')
		expect(formatInterval(0.9)).to.equal('now')
		expect(formatInterval(1)).to.equal('1s')
		expect(formatInterval(59.9)).to.equal('59s')
		expect(formatInterval(60)).to.equal('1m')
		expect(formatInterval(1.9 * minute)).to.equal('1m')
		expect(formatInterval(2 * minute)).to.equal('2m')
		expect(formatInterval(2.9 * minute)).to.equal('2m')
		expect(formatInterval(3 * minute)).to.equal('3m')
		// …
		expect(formatInterval(59.9 * minute)).to.equal('59m')
		expect(formatInterval(60 * minute)).to.equal('1h')
		expect(formatInterval(1.9 * hour)).to.equal('1h')
		expect(formatInterval(2 * hour)).to.equal('2h')
		expect(formatInterval(2.9 * hour)).to.equal('2h')
		expect(formatInterval(3 * hour)).to.equal('3h')
		// …
		expect(formatInterval(23.9 * hour)).to.equal('23h')
		expect(formatInterval(day + 2 * minute + hour)).to.equal('Apr 9')
		// …
		// `month` is about 30.5 days.
		expect(formatInterval(month * 3)).to.equal('Jan 10')
		expect(formatInterval(month * 4)).to.equal('Dec 11, 2015')
		expect(formatInterval(year)).to.equal('Apr 11, 2015')

		// Test future dates.
		// `month` is about 30.5 days.
		expect(formatInterval(-1 * month * 8)).to.equal('Dec 10')
		expect(formatInterval(-1 * month * 9)).to.equal('Jan 9, 2017')
	})

	it('should format Twitter style relative time (Russian) (round: "floor")', () => {
		const timeAgo = new TimeAgo('ru')

		const now = new Date(2016, 3, 10, 22, 59).getTime()
		const formatInterval = (secondsPassed) => timeAgo.format(now - secondsPassed * 1000, { now, ...twitter, round: 'floor' })

		expect(formatInterval(0)).to.equal('сейчас')
		expect(formatInterval(0.9)).to.equal('сейчас')
		expect(formatInterval(1)).to.equal('1 с')
		expect(formatInterval(60)).to.equal('1 мин')
		expect(formatInterval(60 * minute)).to.equal('1 ч')
		expect(formatInterval(day + 62 * minute)).to.equal('9 апр.')
		expect(formatInterval(year)).to.equal('11 апр. 2015 г.')
	})
})