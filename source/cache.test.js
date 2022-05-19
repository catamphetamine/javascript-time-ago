import Cache from './cache.js'

describe('cache', () => {
	it('should cache', () => {
		const cache = new Cache()

		const value = {}
		expect(cache.get('123', '456')).to.be.undefined
		expect(cache.put('123', '456', value)).to.equal(value)
		expect(cache.get('123', '456')).to.equal(value)

		expect(cache.put('123', '789', 123)).to.equal(123)
	})
})
