import { getDate } from './helpers'

describe('gradation helpers', () =>
{
	it('should convert value to Date', () =>
	{
		const today = new Date()
		getDate(today.getTime()).getTime().should.equal(today.getTime())
		getDate(today).getTime().should.equal(today.getTime())
	})
})