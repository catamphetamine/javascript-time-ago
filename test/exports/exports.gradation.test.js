import { describe, it } from 'mocha'
import { expect } from 'chai'

// Deprecated: `gradation` is a legacy name of `steps`. Use `/steps` subpackage instead.

import { day, canonical } from '../../gradation/index.js'

import Library from '../../gradation/index.cjs'

describe('exports/gradation', () => {
	it('should export ES6', () => {
		expect(day).to.be.a('number')
		expect(canonical).to.be.an('array')
	})

	it('should export CommonJS', () => {
		expect(Library.day).to.be.a('number')
		expect(Library.default.day).to.be.a('number')
		expect(Library.canonical).to.be.an('array')
		expect(Library.default.canonical).to.be.an('array')
	})
})