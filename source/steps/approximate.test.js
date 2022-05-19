import getStep from './getStep.js'
import steps from './approximate.js'

describe('steps/approximate', () => {
	it('should get step correctly', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			now: 0,
			units: [
				'now',
				'second',
				'minute',
				'hour',
				'day',
				'week',
				'month',
				'year'
			]
		})

		expect(getStepFor(0).unit).to.equal('now')
		expect(getStepFor(1).unit).to.equal('now')
		expect(getStepFor(45).unit).to.equal('now')

		expect(getStepFor(46).unit).to.equal('minute')
		expect(getStepFor(46).factor).to.equal(60)
		expect(getStepFor(46).granularity).to.be.undefined

		expect(getStepFor(2.5 * 60 - 1).unit).to.equal('minute')
		expect(getStepFor(2.5 * 60 - 1).factor).to.equal(60)
		expect(getStepFor(2.5 * 60 - 1).granularity).to.be.undefined

		expect(getStepFor(2.5 * 60).unit).to.equal('minute')
		expect(getStepFor(2.5 * 60).factor).to.equal(60)
		expect(getStepFor(2.5 * 60).granularity).to.equal(5)

		expect(getStepFor(52.5 * 60 - 1).unit).to.equal('minute')
		expect(getStepFor(52.5 * 60 - 1).factor).to.equal(60)
		expect(getStepFor(52.5 * 60 - 1).granularity).to.equal(5)

		expect(getStepFor(52.5 * 60).unit).to.equal('hour')
		expect(getStepFor(52.5 * 60).factor).to.equal(60 * 60)
	})

	it('should get step correctly ("now" unit not allowed)', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			now: 0,
			units: [
				'second',
				'minute',
				'hour',
				'day',
				'week',
				'month',
				'year'
			]
		})

		expect(getStepFor(0)).to.be.undefined
		expect(getStepFor(1).unit).to.equal('second')
		expect(getStepFor(45).unit).to.equal('second')
		expect(getStepFor(46).unit).to.equal('minute')
	})
})