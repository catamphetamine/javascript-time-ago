import { style } from '../prop-types/index'

describe('exports/prop-types', () => {
	it('should export ES6', () => {
		style.should.be.a('function')
	})

	it('should export CommonJS', () => {
		const Library = require('../prop-types/index.commonjs')
		Library.style.should.be.a('function')
		Library.default.style.should.be.a('function')
	})
})