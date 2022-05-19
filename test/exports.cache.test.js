import Cache from '../cache/index.js'

import Library from '../cache/index.cjs'

describe('exports/cache', () => {
	it('should export ES6', () => {
		new Cache().cache.should.be.an('object')
	})

	it('should export CommonJS', () => {
		new Library().cache.should.be.an('object')
		new Library.default().cache.should.be.an('object')
	})
})