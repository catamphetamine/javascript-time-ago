import
Time_ago,
{
	a_day,
	days_in_a_month,
	days_in_a_year,
	gradation
}
from '../index.es6'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		new Time_ago()
		a_day.should.be.a('number')
		days_in_a_month.should.be.a('number')
		days_in_a_year.should.be.a('number')
		gradation.should.be.an('object')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.common')

		// Load locale specific relative date/time messages
		Library.locale(require('../locales/en'))

		new Library()
		new Library.default()
		Library.a_day.should.be.a('number')
		Library.days_in_a_month.should.be.a('number')
		Library.days_in_a_year.should.be.a('number')
		Library.gradation.should.be.an('object')
	})
})