import { describe, it } from 'mocha'
import { expect } from 'chai'

import style from './miniNow.js'
import TimeAgo from '../TimeAgo.js'
import { hour, minute, day, month, year } from '../steps/index.js'

describe('style/mini-now', () => {
	it('should format relative date/time (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style, round: 'floor' })

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
		expect(formatInterval(24 * hour)).to.equal('1d')
		expect(formatInterval(2 * day)).to.equal('2d')
		expect(formatInterval(7 * day)).to.equal('7d')
		expect(formatInterval(30 * day)).to.equal('30d')
		expect(formatInterval(month)).to.equal('1mo')
		expect(formatInterval(360 * day)).to.equal('11mo')
		expect(formatInterval(366 * day)).to.equal('1yr')
	})
})