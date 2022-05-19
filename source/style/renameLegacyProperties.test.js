import renameLegacyProperties from './renameLegacyProperties.js'

describe('style/renameLegacyProperties', () => {
	it('should rename legacy properties', () => {
		renameLegacyProperties({
			steps: [{
				unit: 'now',
				minTime: {
					week: 2,
					default: 1
				}
			}],
			labels: 'long'
		}).should.deep.equal({
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
		renameLegacyProperties({
			custom
		}).should.deep.equal({
			custom
		})
	})
})