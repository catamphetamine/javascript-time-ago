import { describe, it } from 'mocha'
import { expect } from 'chai'

import Cache from '../../cache/index.js'

import Library from '../../cache/index.cjs'

describe('exports/cache', () => {
	it('should export ES6', () => {
		expect(new Cache().cache).to.be.an('object')
	})

	it('should export CommonJS', () => {
		expect(new Library().cache).to.be.an('object')
		expect(new Library.default().cache).to.be.an('object')
	})
})