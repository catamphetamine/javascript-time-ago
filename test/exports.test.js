import
Time_ago,
{
	day,
	month,
	year,
	gradation,
	intlSupportedLocale
}
from '../index.es6'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		// Load locale specific relative date/time messages
		Time_ago.locale(require('../locale/en'))
		new Time_ago()
		day.should.be.a('number')
		month.should.be.a('number')
		year.should.be.a('number')
		gradation.should.be.an('object')
		intlSupportedLocale('en')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.common')

		// Load locale specific relative date/time messages
		Library.locale(require('../locale/en'))

		new Library()
		new Library.default()
		Library.day.should.be.a('number')
		Library.month.should.be.a('number')
		Library.year.should.be.a('number')
		Library.gradation.should.be.an('object')
		Library.intlSupportedLocale('en')
	})
})