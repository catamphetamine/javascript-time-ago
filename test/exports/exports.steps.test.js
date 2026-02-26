import { describe, it } from 'mocha'
import { expect } from 'chai'

import { day, approximate, round } from '../../steps/index.js'
import Library from '../../steps/index.cjs'

describe('exports/steps', () => {
	it('should export ES6', () => {
		expect(day).to.be.a('number')
		expect(approximate).to.be.an('array')
		expect(round).to.be.an('array')
	})

	it('should export CommonJS', () => {
		expect(Library.day).to.be.a('number')
		expect(Library.approximate).to.be.an('array')
		expect(Library.round).to.be.an('array')
	})
})