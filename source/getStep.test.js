import getStep, { getStepDenominator } from './getStep'
import round from './steps/round'

describe('getStep', () => {
	it('should return nothing if no time units are applicable', () => {
		expect(getStep(0, null, ['femtosecond'], round)).to.be.undefined
	})

	it('should throw if a non-first step does not have a threshold', () => {
		expect(getStep(2, null, ['second'], [{ unit: 'second' }])).to.deep.equal({ unit: 'second' })

		expect(() => {
			getStep(2, null, ['second', 'minute'], [{ unit: 'second' }, { unit: 'minute' }])
		}).to.throw(
			'Each step must have a threshold defined except for the first one. Got "undefined", undefined. Step: {"unit":"minute"}'
		)
	})

	it('should fall back to previous grading scale step if granularity is too high', () => {
		const steps = round.slice()

		steps[1].unit.should.equal('second')
		steps[1].granularity = 3

		getStep(1.49, null, ['now', 'second'], steps).unit.should.equal('now')

		// And if there's no previous step, then use the current one.

		const firstStep = steps[0]
		steps.splice(0, 1)

		getStep(1.49, null, ['now', 'second'], steps).unit.should.equal('second')

		steps.unshift(firstStep)
		delete steps[1].granularity
	})
})

describe('getStepDenominator', () => {
	it('should return 1 as a default denominator', () => {
		getStepDenominator({ unit: 'exotic' }).should.equal(1)
	})
})