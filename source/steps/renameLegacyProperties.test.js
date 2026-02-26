import { describe, it } from 'mocha'
import { expect } from 'chai'

import renameLegacyProperties from './renameLegacyProperties.js'

describe('steps/renameLegacyProperties', () => {
	it('should rename legacy properties', () => {
		expect(renameLegacyProperties({
			formatAs: 'now',
			minTime: 1
		})).to.deep.equal({
			unit: 'now',
			threshold: 1
		})
	})

	it('should rename legacy properties (minTime: undefined)', () => {
		expect(renameLegacyProperties({
			formatAs: 'now'
		})).to.deep.equal({
			unit: 'now'
		})
	})

	it('should rename legacy properties (`minTime` is an object)', () => {
		expect(renameLegacyProperties({
			formatAs: 'now',
			minTime: {
				week: 2,
				default: 1
			}
		})).to.deep.equal({
			unit: 'now',
			threshold: 1,
			threshold_for_week: 2
		})
	})
})