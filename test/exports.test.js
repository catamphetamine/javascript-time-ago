import TimeAgo, {
	intlDateTimeFormatSupported,
	intlDateTimeFormatSupportedLocale
} from '../index'

describe('exports', () => {
	it('should export ES6', () => {
		// Load locale specific relative date/time messages
		TimeAgo.addLocale(require('../locale/en'))
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
	})

	it(`should export CommonJS`, () => {
		const Library = require('../index.commonjs')

		// Load locale specific relative date/time messages
		// Library.addLocale(require('../locale/en'))
		// The legacy `.locale()` function name should still work in version `1.x`.
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
	})
})