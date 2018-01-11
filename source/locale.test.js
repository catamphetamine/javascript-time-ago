import choose_locale, { intlDateTimeFormatSupportedLocale } from '../source/locale'

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
		function array_to_object(array)
		{
			return array.reduce((object, locale) =>
			{
				object[locale] = true
				return object
			},
			{})
		}

		function choose(locale, locales, default_locale = 'en')
		{
			if (typeof locale === 'string')
			{
				locale = [locale]
			}

			locale = locale.concat(default_locale)

			return choose_locale(locale, array_to_object(locales))
		}

		choose('ru-RU', ['en', 'ru']).should.equal('ru')
		choose('en-GB', ['en', 'ru']).should.equal('en')
		choose('fr-FR', ['en', 'ru']).should.equal('en')
		choose(['fr-FR', 'de-DE'], ['en', 'ru']).should.equal('en')
		choose(['fr-FR', 'de-DE'], ['en', 'de']).should.equal('de')
		choose(['fr-FR', 'de-DE'], ['en', 'de', 'fr']).should.equal('fr')
		choose('fr-FR', ['en', 'fr-FR']).should.equal('fr-FR')

		const thrower = () => choose('fr-FR', ['de', 'ru'])
		thrower.should.throw('No locale data has been registered for any of the locales: fr-FR')
	})
})