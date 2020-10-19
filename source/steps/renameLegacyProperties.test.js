import renameLegacyProperties from './renameLegacyProperties'

describe('steps/renameLegacyProperties', () => {
	it('should rename legacy properties', () => {
		renameLegacyProperties({
			formatAs: 'now',
			minTime: 1
		}).should.deep.equal({
			unit: 'now',
			threshold: 1
		})
	})

	it('should rename legacy properties (minTime: undefined)', () => {
		renameLegacyProperties({
			formatAs: 'now'
		}).should.deep.equal({
			unit: 'now'
		})
	})

	it('should rename legacy properties (`minTime` is an object)', () => {
		renameLegacyProperties({
			formatAs: 'now',
			minTime: {
				week: 2,
				default: 1
			}
		}).should.deep.equal({
			unit: 'now',
			threshold: 1,
			threshold_for_week: 2
		})
	})
})