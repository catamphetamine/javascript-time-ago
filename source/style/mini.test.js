import style from './mini'
import TimeAgo from '../TimeAgo'
import { hour, minute, day, month, year } from '../steps'

describe('style/mini', () => {
	it('should format relative date/time (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style, round: 'floor' })

		formatInterval(0).should.equal('0s')
		formatInterval(0.9).should.equal('0s')
		formatInterval(1).should.equal('1s')
		formatInterval(59.9).should.equal('59s')
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
		formatInterval(24 * hour).should.equal('1d')
		formatInterval(2 * day).should.equal('2d')
		formatInterval(7 * day).should.equal('7d')
		formatInterval(30 * day).should.equal('30d')
		formatInterval(month).should.equal('1mo')
		formatInterval(360 * day).should.equal('11mo')
		formatInterval(366 * day).should.equal('1yr')
	})

	it('should format relative date/time (round: "round")', () => {
		const timeAgo = new TimeAgo('en')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style })

		formatInterval(0).should.equal('0s')
		formatInterval(0.49).should.equal('0s')
		formatInterval(0.5).should.equal('1s')
		formatInterval(59.49).should.equal('59s')
		formatInterval(59.5).should.equal('1m')
		formatInterval(1.49 * minute).should.equal('1m')
		formatInterval(1.5 * minute).should.equal('2m')
		formatInterval(2.49 * minute).should.equal('2m')
		formatInterval(2.5 * minute).should.equal('3m')
		// …
		formatInterval(59.49 * minute).should.equal('59m')
		formatInterval(59.5 * minute).should.equal('1h')
		formatInterval(1.49 * hour).should.equal('1h')
		formatInterval(1.5 * hour).should.equal('2h')
		formatInterval(2.49 * hour).should.equal('2h')
		formatInterval(2.5 * hour).should.equal('3h')
		// …
		formatInterval(23.49 * hour).should.equal('23h')
		formatInterval(23.5 * hour).should.equal('1d')
		formatInterval(2 * day).should.equal('2d')
		formatInterval(7 * day).should.equal('7d')
		formatInterval(29 * day).should.equal('29d')
		formatInterval(30 * day).should.equal('1mo')
		formatInterval(month).should.equal('1mo')
		formatInterval(350 * day).should.equal('11mo')
		formatInterval(360 * day).should.equal('1yr')
		formatInterval(366 * day).should.equal('1yr')
	})

	it('should format relative date/time (Russian)', () => {
		const timeAgo = new TimeAgo('ru')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style })

		formatInterval(0).should.equal('0 с')
		formatInterval(1).should.equal('1 с')
		formatInterval(minute).should.equal('1 мин')
		formatInterval(hour).should.equal('1 ч')
		formatInterval(day).should.equal('1 д')
		formatInterval(month).should.equal('1 мес')
		formatInterval(year).should.equal('1 г')
		formatInterval(5 * year).should.equal('5 л')
	})
})