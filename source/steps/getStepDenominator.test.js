import { describe, it } from 'mocha'
import { expect } from 'chai'

import getStepDenominator from './getStepDenominator.js'

describe('getStepDenominator', () => {
	it('should support the older "unit" name', () => {
		expect(getStepDenominator({ unit: 'minute' })).to.equal(60)
	})

	it('should return 1 as a default "denominator"', () => {
		expect(getStepDenominator({ formatAs: 'exotic' })).to.equal(1)
	})
})