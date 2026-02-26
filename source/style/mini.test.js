import { describe, it } from 'mocha'
import { expect } from 'chai'

import style from './mini.js'
import TimeAgo from '../TimeAgo.js'
import { hour, minute, day, month, year } from '../steps/index.js'

describe('style/mini', () => {
	it('should format relative date/time (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style, round: 'floor' })

		expect(formatInterval(0)).to.equal('0s')
		expect(formatInterval(0.9)).to.equal('0s')
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

	it('should format relative date/time (round: "round")', () => {
		const timeAgo = new TimeAgo('en')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style })

		expect(formatInterval(0)).to.equal('0s')
		expect(formatInterval(0.49)).to.equal('0s')
		expect(formatInterval(0.5)).to.equal('1s')
		expect(formatInterval(59.49)).to.equal('59s')
		expect(formatInterval(59.5)).to.equal('1m')
		expect(formatInterval(1.49 * minute)).to.equal('1m')
		expect(formatInterval(1.5 * minute)).to.equal('2m')
		expect(formatInterval(2.49 * minute)).to.equal('2m')
		expect(formatInterval(2.5 * minute)).to.equal('3m')
		// …
		expect(formatInterval(59.49 * minute)).to.equal('59m')
		expect(formatInterval(59.5 * minute)).to.equal('1h')
		expect(formatInterval(1.49 * hour)).to.equal('1h')
		expect(formatInterval(1.5 * hour)).to.equal('2h')
		expect(formatInterval(2.49 * hour)).to.equal('2h')
		expect(formatInterval(2.5 * hour)).to.equal('3h')
		// …
		expect(formatInterval(23.49 * hour)).to.equal('23h')
		expect(formatInterval(23.5 * hour)).to.equal('1d')
		expect(formatInterval(2 * day)).to.equal('2d')
		expect(formatInterval(7 * day)).to.equal('7d')
		expect(formatInterval(29 * day)).to.equal('29d')
		expect(formatInterval(30 * day)).to.equal('1mo')
		expect(formatInterval(month)).to.equal('1mo')
		expect(formatInterval(350 * day)).to.equal('11mo')
		expect(formatInterval(360 * day)).to.equal('1yr')
		expect(formatInterval(366 * day)).to.equal('1yr')
	})

	it('should format relative date/time (Russian)', () => {
		const timeAgo = new TimeAgo('ru')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style })

		expect(formatInterval(0)).to.equal('0 с')
		expect(formatInterval(1)).to.equal('1 с')
		expect(formatInterval(minute)).to.equal('1 мин')
		expect(formatInterval(hour)).to.equal('1 ч')
		expect(formatInterval(day)).to.equal('1 д')
		expect(formatInterval(month)).to.equal('1 мес')
		expect(formatInterval(year)).to.equal('1 г')
		expect(formatInterval(5 * year)).to.equal('5 л')
	})
})