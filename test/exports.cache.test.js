import Cache from '../cache/index'

describe('exports/cache', () => {
	it('should export ES6', () => {
		new Cache().cache.should.be.an('object')
	})

	it('should export CommonJS', () => {
		const Library = require('../cache/index.commonjs')
		new Library().cache.should.be.an('object')
		new Library.default().cache.should.be.an('object')
	})
})