import chooseLocale, { intlDateTimeFormatSupportedLocale } from '../source/locale'

describe('locale', function()
{
	it(`should tell if can use Intl for date formatting`, function()
	{
		intlDateTimeFormatSupportedLocale('en').should.equal('en')
		intlDateTimeFormatSupportedLocale('en-XX').should.equal('en-XX')
		intlDateTimeFormatSupportedLocale(['en', 'ru']).should.equal('en')
	})

	it(`should choose the most appropriate locale`, function()
	{
		function arrayToObject(array)
		{
			return array.reduce((object, locale) => {
				object[locale] = true
				return object
			}, {})
		}

		function choose(locale, locales, defaultLocale = 'en')
		{
			if (typeof locale === 'string') {
				locale = [locale]
			}
			locale = locale.concat(defaultLocale)
			return chooseLocale(locale, _ => locales.includes(_))
		}

		choose('ru-RU', ['en', 'ru']).should.equal('ru')
		choose('en-GB', ['en', 'ru']).should.equal('en')
		choose('fr-FR', ['en', 'ru']).should.equal('en')
		choose(['fr-FR', 'de-DE'], ['en', 'ru']).should.equal('en')
		choose(['fr-FR', 'de-DE'], ['en', 'de']).should.equal('de')
		choose(['fr-FR', 'de-DE'], ['en', 'de', 'fr']).should.equal('fr')
		choose('fr-FR', ['en', 'fr-FR']).should.equal('fr-FR')

		expect(() => choose('fr-FR', ['de', 'ru'])).to.throw(
			'No locale data has been registered for any of the locales: fr-FR'
		)
	})
})