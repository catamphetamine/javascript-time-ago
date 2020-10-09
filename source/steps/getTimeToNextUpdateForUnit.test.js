import getTimeToNextUpdateForUnit from './getTimeToNextUpdateForUnit'

describe('getTimeToNextUpdateForUnit', () => {
	it('should return undefined for unknown units', () => {
		expect(getTimeToNextUpdateForUnit('now', 0, {})).to.be.undefined
	})

	it('should support Date argument', () => {
		getTimeToNextUpdateForUnit('second', new Date(0), {
			future: false,
			now: 0
		}).should.equal(500)
	})

	it('should get time to next update for unit (future)', () => {
		const test = (seconds, expected) => {
			getTimeToNextUpdateForUnit('second', seconds * 1000, {
				future: false,
				now: 0
			}).should.equal(expected * 1000)
		}
		test(9, 0.5)
		test(9.1, 0.6)
		test(9.4, 0.9)
		test(9.5, 1)
		test(9.9, 0.4)
		test(10, 0.5)
	})

	it('should get time to next update for unit (past)', () => {
		const test = (seconds, expected) => {
			getTimeToNextUpdateForUnit('second', -1 * seconds * 1000, {
				future: false,
				now: 0
			}).should.equal(expected * 1000)
		}
		test(9, 0.5)
		test(9.1, 0.4)
		test(9.4, 0.1)
		test(9.5, 1)
		test(9.9, 0.6)
		test(10, 0.5)
	})
})