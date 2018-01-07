import elapsed from '../source/elapsed'
import gradation from '../source/gradation'

import english_cldr from './locales/en-cldr'

describe('elapsed time formatter', function()
{
	it('should return an empty object if no time units are applicable', function()
	{
		elapsed(0, ['femtosecond'], gradation.canonical()).should.deep.equal({})
	})

	it('should fall back to previous grading scale step if granularity is too high', function()
	{
		const _gradation = gradation.canonical()

		_gradation[1].unit.should.equal('second')
		_gradation[1].granularity = 3

		elapsed(1.49, ['just-now', 'second'], _gradation).should.deep.equal
		({
			unit: 'just-now',
			amount: 1
		})

		// And if there's no previous step, then use the current one.
		
		_gradation.splice(0, 1)

		elapsed(1.49, ['just-now', 'second'], _gradation).should.deep.equal
		({
			unit: 'second',
			amount: 0
		})
	})
})