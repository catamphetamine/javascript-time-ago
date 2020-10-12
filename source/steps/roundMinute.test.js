import getStep from './getStep'
import steps from './roundMinute'

describe('steps/roundMinute', () => {
	it('should get step correctly', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			units: [
				'now',
				'second',
				'minute',
				'hour',
				'day',
				'week',
				'month',
				'year'
			]
		})

		// expect(getStepFor(0)).to.be.undefined
		expect(getStepFor(0).formatAs).to.equal('now')
		expect(getStepFor(0.5).formatAs).to.equal('now')
		expect(getStepFor(39.9).formatAs).to.equal('now')
		expect(getStepFor(40).formatAs).to.equal('minute')
		expect(getStepFor(59.5 * 60 - 1).formatAs).to.equal('minute')
		expect(getStepFor(59.5 * 60).formatAs).to.equal('hour')
		expect(getStepFor(24 * 60 * 60).formatAs).to.equal('day')
		expect(getStepFor(7 * 24 * 60 * 60).formatAs).to.equal('week')
	})

	it('should use "minute"s when "now" is not allowed', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			units: [
				'second',
				'minute',
				'hour',
				'day',
				'week',
				'month',
				'year'
			]
		})

		expect(getStepFor(0).formatAs).to.equal('minute')
	})
})