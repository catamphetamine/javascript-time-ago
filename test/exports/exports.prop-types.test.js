import { describe, it } from 'mocha'
import { expect } from 'chai'

import { style } from '../../prop-types/index.js'

import Library from '../../prop-types/index.cjs'

describe('exports/prop-types', () => {
	it('should export ES6', () => {
		expect(style).to.be.a('function')
	})

	it('should export CommonJS', () => {
		expect(Library.style).to.be.a('function')
		expect(Library.default.style).to.be.a('function')
	})
})