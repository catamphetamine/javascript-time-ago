import resolve_locale from '../source/locale'

describe('locale', function()
{
	it(`should resolve locale`, function()
	{
		// function array_to_object(array)
		// {
		// 	return array.reduce((object, locale) =>
		// 	{
		// 		object[locale] = true
		// 		return object
		// 	},
		// 	{})
		// }

		function resolve(locale, locales, default_locale = 'en')
		{
			if (typeof locale === 'string')
			{
				locale = [locale]
			}

			locale = locale.concat(default_locale)

			return resolve_locale(locale, locales) // array_to_object(locales))
		}

		resolve('ru-RU', ['en', 'ru']).should.equal('ru')
		resolve('en-GB', ['en', 'ru']).should.equal('en')
		resolve('fr-FR', ['en', 'ru']).should.equal('en')
		resolve(['fr-FR', 'de-DE'], ['en', 'ru']).should.equal('en')
		resolve(['fr-FR', 'de-DE'], ['en', 'de']).should.equal('de')
		resolve(['fr-FR', 'de-DE'], ['en', 'de', 'fr']).should.equal('fr')
		resolve('fr-FR', ['en', 'fr-FR']).should.equal('fr-FR')
		resolve('en-US', ['en-US-POSIX']).should.equal('en-US')
		resolve('en', ['en-US-POSIX']).should.equal('en')
		
		const thrower = () => resolve('fr-FR', ['de', 'ru'])
		thrower.should.throw('No locale data has been registered for any of the locales: fr-FR')
	})
})