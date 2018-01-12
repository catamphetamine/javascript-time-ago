import grade from '../source/grade'
import { canonical } from '../source/gradation'

describe('grade', function()
{
	it('should return nothing if no time units are applicable', function()
	{
		expect(grade(0, null, ['femtosecond'], canonical)).to.be.undefined
	})

	it('should throw if a non-first step does not have a threshold', function()
	{
		expect(grade(2, null, ['second'], [{ unit: 'second' }])).to.deep.equal({ unit: 'second' })

		const thrower = () => grade(2, null, ['second', 'minute'], [{ unit: 'second' }, { unit: 'minute' }])
		expect(thrower).to.throw('Each step of a gradation must have a threshold defined except for the first one. Got "undefined", undefined. Step: {"unit":"minute"}')
	})

	it('should fall back to previous grading scale step if granularity is too high', function()
	{
		const _gradation = canonical.slice()

		_gradation[1].unit.should.equal('second')
		_gradation[1].granularity = 3

		grade(1.49, null, ['now', 'second'], _gradation).unit.should.equal('now')

		// And if there's no previous step, then use the current one.

		_gradation.splice(0, 1)

		grade(1.49, null, ['now', 'second'], _gradation).unit.should.equal('second')
	})
})