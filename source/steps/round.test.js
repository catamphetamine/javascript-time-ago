import getStep from './getStep.js'
import steps from './round.js'

describe('steps/round', () => {
	it('should get step correctly (round: "floor")', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			round: 'floor',
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

		expect(getStepFor(0).formatAs).to.equal('now')
		expect(getStepFor(0.9).formatAs).to.equal('now')
		expect(getStepFor(1).formatAs).to.equal('second')
		expect(getStepFor(59.9).formatAs).to.equal('second')
		expect(getStepFor(60).formatAs).to.equal('minute')
		expect(getStepFor(60 * 60 - 1).formatAs).to.equal('minute')
		expect(getStepFor(60 * 60).formatAs).to.equal('hour')
		expect(getStepFor(24 * 60 * 60).formatAs).to.equal('day')
		expect(getStepFor(7 * 24 * 60 * 60).formatAs).to.equal('week')
	})

	it('should get step correctly (round: "round")', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			round: 'round',
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

		expect(getStepFor(0).formatAs).to.equal('now')
		expect(getStepFor(0.49).formatAs).to.equal('now')
		expect(getStepFor(0.5).formatAs).to.equal('second')
		expect(getStepFor(1).formatAs).to.equal('second')
		expect(getStepFor(59.4).formatAs).to.equal('second')
		expect(getStepFor(60).formatAs).to.equal('minute')
		expect(getStepFor(59.4 * 60).formatAs).to.equal('minute')
		expect(getStepFor(60 * 60).formatAs).to.equal('hour')
		expect(getStepFor(23.49 * 60 * 60).formatAs).to.equal('hour')
		expect(getStepFor(23.5 * 60 * 60).formatAs).to.equal('day')
		expect(getStepFor(7 * 24 * 60 * 60).formatAs).to.equal('week')
	})

	it('should use "day"s when "week"s are not allowed', () => {
		const getStepFor = (secondsPassed) => getStep(steps, secondsPassed, {
			units: [
				'now',
				'second',
				'minute',
				'hour',
				'day',
				'month',
				'year'
			]
		})

		expect(getStepFor(7 * 24 * 60 * 60).formatAs).to.equal('day')
	})
})