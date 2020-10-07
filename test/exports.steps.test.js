import { day, approximate, round } from '../steps/index'

describe('exports/steps', () => {
	it('should export ES6', () => {
		day.should.be.a('number')
		approximate.should.be.an('array')
		round.should.be.an('array')
	})

	it('should export CommonJS', () => {
		const Library = require('../steps/index.commonjs')
		Library.day.should.be.a('number')
		Library.approximate.should.be.an('array')
		Library.round.should.be.an('array')
	})
})