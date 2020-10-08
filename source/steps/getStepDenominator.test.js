import getStepDenominator from './getStepDenominator'

describe('getStepDenominator', () => {
	it('should support the older "unit" name', () => {
		getStepDenominator({ unit: 'minute' }).should.equal(60)
	})

	it('should return 1 as a default "denominator"', () => {
		getStepDenominator({ formatAs: 'exotic' }).should.equal(1)
	})
})