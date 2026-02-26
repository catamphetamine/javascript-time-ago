import { describe, it } from 'mocha'
import { expect } from 'chai'

import FullDateFormatter, { FallbackDateFormatter } from './FullDateFormatter.js'

describe('FullDateFormatter', () => {
	it('should format full date', () => {
		const formatter = new FullDateFormatter('en')
		expect(
			formatter.format(new Date(Date.UTC(2000, 0, 1)))
		).to.equal('Saturday, January 1, 2000 at 3:00:00 AM')
	})

	it('should format full date (`locales` argument)', () => {
		const formatter = new FullDateFormatter(['en', 'ru'])
		expect(
			formatter.format(new Date(Date.UTC(2000, 0, 1)))
		).to.equal('Saturday, January 1, 2000 at 3:00:00 AM')
	})

	it('should format full date (timestamp)', () => {
		const formatter = new FullDateFormatter('en')
		expect(
			formatter.format(Date.UTC(2000, 0, 1))
		).to.equal('Saturday, January 1, 2000 at 3:00:00 AM')
	})

	it('should fallback to non-`Intl` formatter', () => {
		const formatter = new FallbackDateFormatter('en')
		// The output depends on the user's time zone.
		// Example when running in Moscow: "Sat Jan 01 2000 03:00:00 GMT+0300 (Moscow Standard Time)".
		expect(
			formatter.format(new Date(Date.UTC(2000, 1, 1)))
		).to.include(':00:00 GMT')
	})
})