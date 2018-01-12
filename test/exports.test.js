import TimeAgo,
{
	intlDateTimeFormatSupported,
	intlDateTimeFormatSupportedLocale,
	RelativeTimeFormat
}
from '../index'

import PropTypes from '../prop-types'
import Cache from '../cache'
import { canonical, convenient } from '../gradation'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		// Load locale specific relative date/time messages
		TimeAgo.locale(require('../locale/en'))
		new TimeAgo().format(new Date()).should.be.a('string')
		// day.should.be.a('number')
		// month.should.be.a('number')
		// year.should.be.a('number')
		// gradation.should.be.an('object')
		// gradation.twitter.should.be.an('object')
		// gradation.twitter.custom.should.be.a('function')
		// gradation.time.should.be.an('object')
		intlDateTimeFormatSupported().should.be.a('boolean')
		intlDateTimeFormatSupportedLocale('en').should.be.a('string')
		new RelativeTimeFormat('en').format(1, 'day').should.be.a('string')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')

		// Load locale specific relative date/time messages
		Library.locale(require('../locale/en'))

		new Library().format(new Date()).should.be.a('string')
		new Library.default().format(new Date()).should.be.a('string')
		// Library.day.should.be.a('number')
		// Library.month.should.be.a('number')
		// Library.year.should.be.a('number')
		// Library.gradation.should.be.an('object')
		// Library.gradation.twitter.should.be.an('object')
		// Library.gradation.twitter.custom.should.be.a('function')
		// Library.gradation.time.should.be.an('object')
		Library.intlDateTimeFormatSupported().should.be.a('boolean')
		Library.intlDateTimeFormatSupportedLocale('en').should.be.a('string')
		new Library.RelativeTimeFormat('en').format(1, 'day').should.be.a('string')
	})

	it(`should export PropTypes`, function()
	{
		PropTypes.style.should.be.a('function')
	})

	it(`should export Cache`, function()
	{
		new Cache().cache.should.be.an('object')
	})

	it(`should export gradation`, function()
	{
		canonical.should.be.an('array')
		convenient.should.be.an('array')
	})
})