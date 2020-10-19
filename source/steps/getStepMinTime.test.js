import getStepMinTime from './getStepMinTime'

describe('getStepMinTime', () => {
	it('should support `step.test()` function (returns true)', () => {
		getStepMinTime({
			test: () => true
		}, {
			prevStep: { minTime: 1 }
		}).should.equal(0)
	})

	it('should support `step.test()` function (returns false)', () => {
		getStepMinTime({
			test: () => false
		}, {
			prevStep: { minTime: 1 }
		}).should.equal(9007199254740991)
	})
})