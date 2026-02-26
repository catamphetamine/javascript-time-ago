import { describe, it } from 'mocha'
import { expect } from 'chai'

import TimeAgo, {
	intlDateTimeFormatSupported,
	intlDateTimeFormatSupportedLocale
} from '../../index.js'

import Library from '../../index.cjs'

import en from '../../locale/en.json' with { type: 'json' }

describe('exports', () => {
	it('should export ES6', () => {
		// Load locale specific relative date/time messages
		TimeAgo.addLocale(en)
		expect(new TimeAgo().format(new Date())).to.be.a('string')
		expect(intlDateTimeFormatSupported()).to.be.a('boolean')
		expect(intlDateTimeFormatSupportedLocale('en')).to.be.a('string')
	})

	it(`should export CommonJS`, () => {
		// Load locale specific relative date/time messages
		// Library.addLocale(require('../locale/en'))
		// The legacy `.locale()` function name should still work in version `1.x`.
		Library.locale(en)

		expect(new Library().format(new Date())).to.be.a('string')
		expect(new Library.default().format(new Date())).to.be.a('string')
		expect(Library.intlDateTimeFormatSupported()).to.be.a('boolean')
		expect(Library.intlDateTimeFormatSupportedLocale('en')).to.be.a('string')
	})
})