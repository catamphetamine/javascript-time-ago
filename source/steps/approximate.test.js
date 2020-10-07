import getStep from '../getStep'
import steps from './approximate'

describe('steps/approximate', () => {
	it('should get step correctly', () => {
		const test = (elapsed) => getStep(elapsed, null, [
			'second',
			'minute',
			'hour',
			'day',
			'month',
			'year'
		], steps)

		expect(test(0)).to.be.undefined

		expect(test(1).unit).to.equal('second')
		expect(test(1).factor).to.equal(1)

		expect(test(45).unit).to.equal('second')
		expect(test(45).factor).to.equal(1)

		expect(test(46).unit).to.equal('minute')
		expect(test(46).factor).to.equal(60)
		expect(test(46).granularity).to.be.undefined

		expect(test(2.5 * 60 - 1).unit).to.equal('minute')
		expect(test(2.5 * 60 - 1).factor).to.equal(60)
		expect(test(2.5 * 60 - 1).granularity).to.be.undefined

		expect(test(2.5 * 60).unit).to.equal('minute')
		expect(test(2.5 * 60).factor).to.equal(60)
		expect(test(2.5 * 60).granularity).to.equal(5)

		expect(test(52.5 * 60 - 1).unit).to.equal('minute')
		expect(test(52.5 * 60 - 1).factor).to.equal(60)
		expect(test(52.5 * 60 - 1).granularity).to.equal(5)

		expect(test(52.5 * 60).unit).to.equal('hour')
		expect(test(52.5 * 60).factor).to.equal(60 * 60)
	})
})