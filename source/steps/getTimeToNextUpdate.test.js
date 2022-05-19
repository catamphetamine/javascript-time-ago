import getTimeToNextUpdate, { INFINITY, getStepChangesAt, getTimeToStepChange } from './getTimeToNextUpdate.js'

describe('getTimeToNextUpdate', () => {
	it('should return infinity when there are no more steps, and it does not format as a unit (past)', () => {
		expect(getTimeToNextUpdate(-4 * 60 * 1000, {
			minTime: 59.5,
			format: () => ''
		}, {
			now: 0,
			future: false,
			isFirstStep: true
		})).to.equal(INFINITY)
	})

	it('should support date argument', () => {
		expect(getTimeToNextUpdate(new Date(4 * 60 * 1000), {
			minTime: 60
		}, {
			now: 0,
			future: true,
			isFirstStep: true,
			nextStep: {}
		})).to.equal(3 * 60 * 1000 + 1)
	})

	it('should return this step\'s "minTime" timestamp (future)', () => {
		expect(getTimeToNextUpdate(4 * 60 * 1000, {
			minTime: 60,
			format: () => ''
		}, {
			now: 0,
			future: true,
			isFirstStep: true,
			nextStep: {
				format: () => ''
			}
		})).to.equal(3 * 60 * 1000 + 1)
	})

	it('should return undefined when there is a next step and time to next update can not be reliably determined (formatAs) (past)', () => {
		expect(getTimeToNextUpdate(-4 * 60 * 1000, {
			minTime: 60,
			formatAs: 'minute'
		}, {
			now: 0,
			future: false,
			isFirstStep: true,
			nextStep: {
				formatAs: 'unknown-time-unit'
			}
		})).to.be.undefined
	})

	it('should get time to next update (no next step) (past)', () => {
		getTimeToNextUpdate(-4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			isFirstStep: true
		}).should.equal(0.5 * 60 * 1000)
	})

	it('should get time to next update (no next step) (future)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: true,
			isFirstStep: true
		}).should.equal(0.5 * 60 * 1000 + 1)
	})

	it('should get time to next update (has prev/next step without `minTime`) (future)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: true,
			isFirstStep: true,
			nextStep: {
				formatAs: 'hour',
				test: () => false
			}
		}).should.equal(0.5 * 60 * 1000 + 1)
	})

	it('should get time to next update (has `getTimeToNextUpdate`) (past)', () => {
		getTimeToNextUpdate(-4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5,
			getTimeToNextUpdate: () => 0.25 * 60 * 1000
		}, {
			now: 0,
			future: false,
			isFirstStep: true
		}).should.equal(0.25 * 60 * 1000)
	})

	it('should get time to next update (has `getTimeToNextUpdate`) (future)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5,
			getTimeToNextUpdate: () => 0.25 * 60 * 1000
		}, {
			now: 0,
			future: true,
			isFirstStep: true
		}).should.equal(0.25 * 60 * 1000)
	})

	it('should get time to next update (has both unit and prev/next steps with `minTime`) (returns time to "minTime" of next step) (past)', () => {
		getTimeToNextUpdate(-59 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			isFirstStep: true,
			nextStep: {
				formatAs: 'hour',
				minTime: 59.5 * 60
			}
		}).should.equal(0.5 * 60 * 1000)
	})

	it('should get time to next update (has no unit but has prev/next step with `minTime`) (returns time to "minTime" of next step) (past)', () => {
		getTimeToNextUpdate(-59 * 60 * 1000, {
			format: () => {},
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			isFirstStep: true,
			nextStep: {
				formatAs: 'hour',
				minTime: 59.5 * 60
			}
		}).should.equal(0.5 * 60 * 1000)
	})

	it('should get time to next update (will be outside of the first step) (future)', () => {
		getTimeToNextUpdate(60 * 60 * 1000, {
			formatAs: 'hour',
			minTime: 60 * 60
		}, {
			now: 0,
			future: true,
			isFirstStep: true
		}).should.equal(1)
	})
})

describe('getStepChangesAt', () => {
	it('should work for "round" steps', () => {
		// Future.
		// Is at zero point.
		// No next step.
		// No tickable unit.
		// Doesn't update.
		getStepChangesAt({
			unit: 'now'
		}, 0, {
			now: 0,
			future: false,
			prevStep: undefined
		}).should.equal(INFINITY)

		// Past.
		// Is at zero point.
		// The next step is seconds.
		// Updates at the next step.
		getStepChangesAt({
			unit: 'second',
			minTime: 1
		}, 0, {
			now: 0,
			future: false,
			prevStep: {}
		}).should.equal(1 * 1000)

		// Future.
		// Inside the first step.
		// Updates after zero point.
		getStepChangesAt({
			unit: 'now'
		}, 0.9 * 1000, {
			now: 0,
			future: true,
			prevStep: undefined
		}).should.equal(0.9 * 1000 + 1)

		// Future.
		// The first step doesn't start at 0.
		// Outside of the first step.
		// Updates right after zero point.
		getTimeToStepChange(undefined, 0.9 * 1000, {
			now: 0,
			future: true,
			prevStep: undefined
		}).should.equal(0.9 * 1000 + 1)

		// Past.
		// The current step is `undefined`.
		// The next step is the first step.
		// The first step doesn't start at 0.
		// Outside of the first step.
		// Updates at entering the first step.
		getStepChangesAt({
			minTime: 1,
			unit: 'second'
		}, -0.9 * 1000, {
			now: 0,
			future: false,
			prevStep: {}
		}).should.equal(0.1 * 1000)

		// Future.
		// The first step doesn't start at 0.
		// Will output empty string after it exits the current step.
		getStepChangesAt({
			minTime: 1,
			unit: 'second'
		}, 1.1 * 1000, {
			now: 0,
			future: true,
			prevStep: undefined
		}).should.equal(0.1 * 1000 + 1)

		// Past.
		// Next step is seconds.
		// The "next" step doesn't have `minTime`,
		// so "time to next update" couldn't be determined.
		expect(getStepChangesAt({
			unit: 'unknown-time-unit'
		}, 0, {
			now: 0,
			future: false,
			prevStep: {}
		})).to.be.undefined

		// Past.
		// No next step.
		// The last step never changes.
		getTimeToStepChange(undefined, 0, {
			now: 0,
			future: false,
			isFirstStep: undefined
		}).should.equal(INFINITY)

		// Future.
		// Current step is seconds.
		// Updates after zero point.
		getStepChangesAt({
			unit: 'second'
		}, 0, {
			now: 0,
			future: true,
			prevStep: undefined
		}).should.equal(1)

		// Past.
		// Next step is minutes.
		// Already at zero point, so no need to update at zero point.
		getStepChangesAt({
			minTime: 60,
			formatAs: 'minute'
		}, 0, {
			now: 0,
			future: false,
			prevStep: {}
		}).should.equal(60 * 1000)
	})
})