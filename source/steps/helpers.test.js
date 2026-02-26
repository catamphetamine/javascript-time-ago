import { describe, it } from 'mocha'
import { expect } from 'chai'

import { getDate } from './helpers.js'

describe('steps/helpers', () => {
	it('should convert value to Date', () => {
		const today = new Date()
		expect(getDate(today.getTime()).getTime()).to.equal(today.getTime())
		expect(getDate(today).getTime()).to.equal(today.getTime())
	})
})