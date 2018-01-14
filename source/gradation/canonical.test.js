import grade from '../grade'
import gradation from './canonical'

// Perhaps this should be part of `grade.test.js` instead.

describe('canonical gradation', function()
{
	it('should grade correctly', function()
	{
		const test = (elapsed) => grade(elapsed, null,
		[
			'second',
			'minute',
			'hour',
			'day',
			'month',
			'year'
		],
		gradation)

		expect(test(0)).to.be.undefined

		expect(test(0.5).unit).to.equal('second')
		expect(test(0.5).factor).to.equal(1)

		expect(test(59.4).unit).to.equal('second')
		expect(test(59.4).factor).to.equal(1)

		expect(test(59.5).unit).to.equal('minute')
		expect(test(59.5).factor).to.equal(60)

		expect(test(59.5 * 60 - 1).unit).to.equal('minute')
		expect(test(59.5 * 60 - 1).factor).to.equal(60)

		expect(test(59.5 * 60).unit).to.equal('hour')
		expect(test(59.5 * 60).factor).to.equal(60 * 60)
	})
})