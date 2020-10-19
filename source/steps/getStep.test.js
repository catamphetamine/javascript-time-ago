import getStep from './getStep'
import round from './round'

describe('getStep', () => {
	it('should return nothing if no time units are supported', () => {
		expect(getStep(round, 0, { units: ['femtosecond'] })).to.be.undefined
	})

	// it('should throw if a non-first step does not have a `minTime` or `test()`', () => {
	// 	expect(getStep([{ unit: 'second' }], 2, { units: ['second'] })).to.deep.equal({ unit: 'second' })
	//
	// 	expect(() => {
	// 		getStep([{ unit: 'second' }, { unit: 'minute' }], 2, { units: ['second', 'minute'] })
	// 	}).to.throw(
	// 		'Each step must define either `minTime` or `test()`, except for the first one. Got "undefined", undefined. Step: {"unit":"minute"}'
	// 	)
	// })

	it('should fall back to previous step if granularity is too high for the next step', () => {
		const steps = round.slice()

		steps[1].formatAs.should.equal('second')
		steps[1].granularity = 3

		getStep(steps, 1.49, { now: 0, units: ['now', 'second'] }).formatAs.should.equal('now')

		// And if there's no previous step, then use the current one.

		const firstStep = steps[0]
		steps.splice(0, 1)

		getStep(steps, 1.49, { now: 0, units: ['now', 'second'] }).formatAs.should.equal('second')

		steps.unshift(firstStep)

		delete steps[1].granularity
	})

	it('should support `minTime` object', () => {
		expect(getStep(
			[
				{ unit: 'second' },
				{
					minTime: { default: 10 },
					unit: 'minute'
				}
			],
			5,
			{ now: 0, units: ['second', 'minute'] }
		).unit).to.equal('second')

		expect(getStep(
			[
				{ unit: 'second' },
				{
					minTime: { default: 10 },
					unit: 'minute'
				}
			],
			10,
			{ now: 0, units: ['second', 'minute'] }
		).unit).to.equal('minute')

		expect(getStep(
			[
				{
					id: 'seconds',
					unit: 'second'
				},
				{
					minTime: {
						seconds: 20,
						default: 10
					},
					unit: 'minute'
				}
			],
			10,
			{ now: 0, units: ['second', 'minute'] }
		).unit).to.equal('second')
	})

	it('should support legacy `threshold()` function', () => {
		expect(getStep(
			[
				{ unit: 'second' },
				{
					threshold: () => 10,
					unit: 'minute'
				}
			],
			5,
			{ now: 0, units: ['second', 'minute'] }
		).unit).to.equal('second')

		expect(getStep(
			[
				{ unit: 'second' },
				{
					threshold: () => 10,
					unit: 'minute'
				}
			],
			10,
			{ now: 0, units: ['second', 'minute'] }
		).unit).to.equal('minute')
	})

	it('should stop when reaching a step that has no "minTime" and for which "minTime" could not be deduced', () => {
		expect(getStep(
			[
				{ formatAs: 'second' },
				{ formatAs: 'unsupported-time-unit' }
			],
			10,
			{ now: 0, units: ['second', 'unsupported-time-unit'] }
		).formatAs).to.equal('second')
	})
})