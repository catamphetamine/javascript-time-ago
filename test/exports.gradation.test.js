// Deprecated: `gradation` is a legacy name of `steps`. Use `/steps` subpackage instead.

import { day, canonical } from '../gradation/index.js'

import Library from '../gradation/index.cjs'

describe('exports/gradation', () => {
	it('should export ES6', () => {
		day.should.be.a('number')
		canonical.should.be.an('array')
	})

	it('should export CommonJS', () => {
		Library.day.should.be.a('number')
		Library.default.day.should.be.a('number')
		Library.canonical.should.be.an('array')
		Library.default.canonical.should.be.an('array')
	})
})