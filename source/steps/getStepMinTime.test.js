import { describe, it } from 'mocha'
import { expect } from 'chai'

import getStepMinTime from './getStepMinTime.js'

describe('getStepMinTime', () => {
	it('should support `step.test()` function (returns true)', () => {
		expect(getStepMinTime({
			test: () => true
		}, {
			prevStep: { minTime: 1 }
		})).to.equal(0)
	})

	it('should support `step.test()` function (returns false)', () => {
		expect(getStepMinTime({
			test: () => false
		}, {
			prevStep: { minTime: 1 }
		})).to.equal(9007199254740991)
	})
})