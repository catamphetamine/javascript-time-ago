import parse_locale_data from '../source/locale data'

import english_cldr from './locales/en-cldr'

describe('locale data', function()
{
	it('should parse CLDR locale data', function()
	{
		parse_locale_data(english_cldr).locale.should.equal('en-US-POSIX')
	})

	it('should guard agains empty locale data', function()
	{
		const thrower = () => parse_locale_data()
		thrower.should.throw('The passed in locale data is undefined')
	})

	it('should guard agains malformed input', function()
	{
		const thrower = () => parse_locale_data({ long: {} })
		thrower.should.throw('Couldn\'t determine locale for this locale data')
	})

	it('should default to any available style if "long" is absent', function()
	{
		parse_locale_data
		({
			locale: 'en',
			short: { second: {} }
		})
		.locale_data.default.should.deep.equal({ second: {} })
	})

	it('should not override the default style if defined', function()
	{
		parse_locale_data
		({
			locale: 'en',
			default: { minute: {} },
			short: { second: {} }
		})
		.locale_data.default.should.deep.equal({ minute: {} })
	})
})