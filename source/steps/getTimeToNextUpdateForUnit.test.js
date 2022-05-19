import getTimeToNextUpdateForUnit from './getTimeToNextUpdateForUnit.js'

describe('getTimeToNextUpdateForUnit', () => {
	it('should return undefined for unknown units', () => {
		expect(getTimeToNextUpdateForUnit('now', 0, {})).to.be.undefined
	})

	it('should support Date argument', () => {
		getTimeToNextUpdateForUnit('second', new Date(0), {
			// future: false,
			now: 0
		}).should.equal(500)
	})

	it('should get time to next update for unit (future)', () => {
		const test = (seconds, expected, addOneMs = true) => {
			getTimeToNextUpdateForUnit('second', seconds * 1000, {
				// future: true,
				now: 0
			}).should.equal(expected * 1000 + (addOneMs ? 1 : 0))
		}

		test(9, 0.5)
		test(9.1, 0.6)
		test(9.4, 0.9)
		test(9.5, 0)
		test(9.9, 0.4)
		test(10, 0.5)

		test(1.1, 0.6)
		test(1, 0.5)
		test(0.9, 0.4)
		test(0.5, 0)
		test(0.4, 0.4)
		test(0, 0.5, false)
	})

	it('should get time to next update for unit (past)', () => {
		const test = (seconds, expected, addOneMs = true) => {
			getTimeToNextUpdateForUnit('second', -1 * seconds * 1000, {
				// future: false,
				now: 0
			}).should.equal(expected * 1000)
		}

		test(10, 0.5)
		test(9.9, 0.6)
		test(9.5, 1)
		test(9.4, 0.1)
		test(9.1, 0.4)
		test(9, 0.5)

		test(0, 0.5, false)
		test(0.5, 1, false)
		test(0.9, 0.6, false)
		test(1, 0.5, false)
		test(1.1, 0.4, false)
	})

	it('should support "floor" rounding (future)', () => {
		const test = (seconds, expected, addOneMs = true) => {
			getTimeToNextUpdateForUnit('second', seconds * 1000, {
				// future: true,
				now: 0,
				round: 'floor'
			}).should.equal(expected * 1000 + (addOneMs ? 1 : 0))
		}

		test(9, 0)
		test(9.1, 0.1)
		test(9.4, 0.4)
		test(9.5, 0.5)
		test(9.9, 0.9)
		test(10, 0)

		test(1.1, 0.1)
		test(1, 0)
		test(0.9, 0.9)
		test(0.5, 0.5)
		test(0.1, 0.1)
		test(0, 1, false)
	})

	it('should support "floor" rounding (past)', () => {
		const test = (seconds, expected) => {
			getTimeToNextUpdateForUnit('second', -1 * seconds * 1000, {
				// future: false,
				now: 0,
				round: 'floor'
			}).should.equal(expected * 1000)
		}

		test(10, 1)
		test(9.9, 0.1)
		test(9.5, 0.5)
		test(9.4, 0.6)
		test(9.1, 0.9)
		test(9, 1)

		test(0, 1)
		test(0.5, 0.5)
		test(0.9, 0.1)
		test(1, 1)
		test(1.1, 0.9)
	})
})