import { describe, it } from 'mocha'
import { expect } from 'chai'

import renameLegacyProperties from './renameLegacyProperties.js'

describe('style/renameLegacyProperties', () => {
	it('should rename legacy properties', () => {
		expect(renameLegacyProperties({
			steps: [{
				unit: 'now',
				minTime: {
					week: 2,
					default: 1
				}
			}],
			labels: 'long'
		})).to.deep.equal({
			gradation: [{
				unit: 'now',
				threshold: 1,
				threshold_for_week: 2
			}],
			flavour: 'long'
		})
	})

	it('should cover edge cases', () => {
		const custom = () => {}
		expect(renameLegacyProperties({
			custom
		})).to.deep.equal({
			custom
		})
	})
})