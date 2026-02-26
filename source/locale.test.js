import { describe, it } from 'mocha'
import { expect } from 'chai'

import chooseLocale, { intlDateTimeFormatSupportedLocale } from './locale.js'

describe('locale', () => {
	it(`should tell if can use Intl for date formatting`, () => {
		expect(intlDateTimeFormatSupportedLocale('en')).to.equal('en')
		expect(intlDateTimeFormatSupportedLocale('en-XX')).to.equal('en-XX')
		expect(intlDateTimeFormatSupportedLocale(['en', 'ru'])).to.equal('en')
	})

	it(`should choose the most appropriate locale`, () => {
		function arrayToObject(array) {
			return array.reduce((object, locale) => {
				object[locale] = true
				return object
			}, {})
		}

		function choose(locale, locales, defaultLocale = 'en') {
			if (typeof locale === 'string') {
				locale = [locale]
			}
			locale = locale.concat(defaultLocale)
			return chooseLocale(locale, _ => locales.includes(_))
		}

		expect(choose('ru-RU', ['en', 'ru'])).to.equal('ru')
		expect(choose('en-GB', ['en', 'ru'])).to.equal('en')
		expect(choose('fr-FR', ['en', 'ru'])).to.equal('en')
		expect(choose(['fr-FR', 'de-DE'], ['en', 'ru'])).to.equal('en')
		expect(choose(['fr-FR', 'de-DE'], ['en', 'de'])).to.equal('de')
		expect(choose(['fr-FR', 'de-DE'], ['en', 'de', 'fr'])).to.equal('fr')
		expect(choose('fr-FR', ['en', 'fr-FR'])).to.equal('fr-FR')

		expect(() => choose('fr-FR', ['de', 'ru'])).to.throw(
			'No locale data has been registered for any of the locales: fr-FR'
		)
	})
})