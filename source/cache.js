/**
 * A basic in-memory cache.
 *
 * import Cache from 'javascript-time-ago/Cache'
 * const cache = new Cache()
 * const object = cache.get('key1', 'key2', ...) || cache.put('key1', 'key2', ..., createObject())
 */
export default class Cache {
	constructor() {
		this.cache = {}
	}

	get(...keys) {
		let cache = this.cache
		for (const key of keys) {
			if (typeof cache !== 'object') {
				return
			}
			cache = cache[key]
		}
		return cache
	}

	put(...keys) {
		const value = keys.pop()
		const lastKey = keys.pop()
		let cache = this.cache
		for (const key of keys) {
			if (typeof cache[key] !== 'object') {
				cache[key] = {}
			}
			cache = cache[key]
		}
		return cache[lastKey] = value
	}
}