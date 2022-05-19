import { style } from '../prop-types/index.js'

import Library from '../prop-types/index.cjs'

describe('exports/prop-types', () => {
	it('should export ES6', () => {
		style.should.be.a('function')
	})

	it('should export CommonJS', () => {
		Library.style.should.be.a('function')
		Library.default.style.should.be.a('function')
	})
})