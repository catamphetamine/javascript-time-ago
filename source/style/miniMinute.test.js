import style from './miniMinute'
import TimeAgo from '../TimeAgo'
import { hour, minute, day, month, year } from '../steps'

describe('style/mini-now', () => {
	it('should format relative date/time (round: "floor")', () => {
		const timeAgo = new TimeAgo('en')
		const formatInterval = (secondsPassed) => timeAgo.format(-secondsPassed * 1000, { now: 0, ...style, round: 'floor' })

		formatInterval(0).should.equal('0m')
		formatInterval(0.9).should.equal('0m')
		formatInterval(1).should.equal('0m')
		formatInterval(59.9).should.equal('0m')
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
})