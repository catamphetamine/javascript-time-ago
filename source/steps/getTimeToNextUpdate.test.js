import getTimeToNextUpdate from './getTimeToNextUpdate'

describe('getTimeToNextUpdate', () => {
	it('should return undefined when time to next update can not be reliably determined', () => {
		expect(getTimeToNextUpdate(4 * 60 * 1000, {
			minTime: 59.5,
			format: () => ''
		}, {
			now: 0,
			future: false
		})).to.be.undefined
	})

	it('should get time to next update (no next step)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: false
		}).should.equal(0.5 * 60 * 1000)
	})

	it('should get time to next update (has next step without `minTime`)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			nextStep: {
				formatAs: 'hour',
				test: () => false
			}
		}).should.equal(0.5 * 60 * 1000)
	})

	it('should get time to next update (has `getTimeToNextUpdate`)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5,
			getTimeToNextUpdate: () => 0.25 * 60 * 1000
		}, {
			now: 0,
			future: false
		}).should.equal(0.25 * 60 * 1000)
	})

	it('should get time to next update (has both unit and next step with `minTime`)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			nextStep: {
				formatAs: 'hour',
				minTime: 59.5 * 60
			}
		}).should.equal(0.5 * 60 * 1000)
	})

	it('should get time to next update (has no unit but has next step with `minTime`)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			format: () => {},
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			nextStep: {
				formatAs: 'hour',
				minTime: 59.5 * 60
			}
		}).should.equal(59.5 * 60 * 1000)
	})

	it('should get time to next update (has next step with legacy `threshold()` function)', () => {
		getTimeToNextUpdate(4 * 60 * 1000, {
			formatAs: 'minute',
			minTime: 59.5
		}, {
			now: 0,
			future: false,
			nextStep: {
				formatAs: 'hour',
				threshold: () => 59.5 * 60
			}
		}).should.equal(0.5 * 60 * 1000)
	})
})