import { getDate } from './helpers'

describe('gradation helpers', function()
{
	it('should convert value to Date', function()
	{
		const today = new Date()
		getDate(today.getTime()).getTime().should.equal(today.getTime())
		getDate(today).getTime().should.equal(today.getTime())
	})
})