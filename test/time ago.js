import chai from 'chai'
chai.should()

import react_time_ago from '../source/time ago'

// Load locale specific relative date/time messages
import { short as english_short, long as english_long } from '../source/locales/en'
import { short as russian_short, long as russian_long }  from '../source/locales/ru'

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
global.IntlMessageFormat = require('intl-messageformat')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')

describe(`time ago`, function()
{
	let time_ago

	beforeEach(function()
	{
		// Set locale specific relative date/time messages
		react_time_ago.locale('en', english_long)
		react_time_ago.locale('ru', russian_long)
	})

	afterEach(function()
	{
		//
	})

	it(`should format time correctly for English language (short)`, function()
	{
		react_time_ago.locale('en', english_short)

		time_ago = new react_time_ago('en')

		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now })

		elapsed(0     ).should.equal('0 sec. ago')

		// elapsed(0     ).should.deep.equal('just now')
	})

	it(`should format time correctly for English language (long)`, function()
	{
		react_time_ago.locale('en', english_long)

		time_ago = new react_time_ago('en')
		
		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now })

		elapsed(0     ).should.equal('0 seconds ago')
	})

	it(`should format time correctly for Russian language (short)`, function()
	{
		react_time_ago.locale('ru', russian_short)

		time_ago = new react_time_ago('ru')

		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now })

		elapsed(0     ).should.equal('0 сек. назад')

		// elapsed(59.999).should.equal('только что')
		// elapsed(60    ).should.equal('1-ной минутой ранее')

		// elapsed(1.499 * 60).should.equal('1-ной минутой ранее')
		// elapsed(1.5   * 60).should.equal('2-мя минутами ранее')
		// elapsed(2.499 * 60).should.equal('2-мя минутами ранее')
		// elapsed(2.5   * 60).should.equal('3-мя минутами ранее')
		// elapsed(3.499 * 60).should.equal('3-мя минутами ранее')
		// elapsed(3.5   * 60).should.equal('4-мя минутами ранее')
		// elapsed(4.499 * 60).should.equal('4-мя минутами ранее')
		// elapsed(4.5   * 60).should.equal('5-ю минутами ранее')
		// elapsed(7.499 * 60).should.equal('5-ю минутами ранее')
		// elapsed(7.5   * 60).should.equal('10-ю минутами ранее')
		// elapsed(12.499 * 60).should.equal('10-ю минутами ранее')
		// elapsed(12.5   * 60).should.equal('15-ю минутами ранее')
		// elapsed(17.499 * 60).should.equal('15-ю минутами ранее')
		// elapsed(17.5   * 60).should.equal('20-ю минутами ранее')
		// elapsed(22.499 * 60).should.equal('20-ю минутами ранее')
		// elapsed(22.5   * 60).should.equal('25-ю минутами ранее')
		// elapsed(27.499 * 60).should.equal('25-ю минутами ранее')
		// elapsed(27.5   * 60).should.equal('получасом ранее')
		// elapsed(44.499 * 60).should.equal('получасом ранее')
		// elapsed(45     * 60).should.equal('часом ранее')

		// elapsed(1.2499 * 60 * 60).should.equal('часом ранее')
		// elapsed(1.25   * 60 * 60).should.equal('полутора часами ранее')
		// elapsed(1.7499 * 60 * 60).should.equal('полутора часами ранее')
		// elapsed(1.75   * 60 * 60).should.equal('2-мя часами ранее')
		// elapsed(2.499  * 60 * 60).should.equal('2-мя часами ранее')
		// elapsed(2.5    * 60 * 60).should.equal('3-мя часами ранее')
		// elapsed(3.499  * 60 * 60).should.equal('3-мя часами ранее')
		// elapsed(3.5    * 60 * 60).should.equal('4-мя часами ранее')
		// elapsed(4.499  * 60 * 60).should.equal('4-мя часами ранее')
		// elapsed(4.5    * 60 * 60).should.equal('5-ю часами ранее')
		// elapsed(5.499  * 60 * 60).should.equal('5-ю часами ранее')
		// elapsed(5.5    * 60 * 60).should.equal('6-ю часами ранее')
		// elapsed(6.499  * 60 * 60).should.equal('6-ю часами ранее')
		// elapsed(6.5    * 60 * 60).should.equal('7-ю часами ранее')
		// elapsed(7.499  * 60 * 60).should.equal('7-ю часами ранее')
		// elapsed(7.5    * 60 * 60).should.equal('8-ю часами ранее')
		// elapsed(8.499  * 60 * 60).should.equal('8-ю часами ранее')
		// elapsed(8.5    * 60 * 60).should.equal('9-ю часами ранее')
		// elapsed(9.499  * 60 * 60).should.equal('9-ю часами ранее')
		// elapsed(9.5    * 60 * 60).should.equal('10-ю часами ранее')
		// elapsed(10.499  * 60 * 60).should.equal('10-ю часами ранее')
		// elapsed(10.5    * 60 * 60).should.equal('11-ю часами ранее')
		// elapsed(11.499  * 60 * 60).should.equal('11-ю часами ранее')
		// elapsed(11.5    * 60 * 60).should.equal('12-ю часами ранее')
		// elapsed(12.499  * 60 * 60).should.equal('12-ю часами ранее')
		// elapsed(12.5    * 60 * 60).should.equal('13-ю часами ранее')
		// elapsed(13.499  * 60 * 60).should.equal('13-ю часами ранее')
		// elapsed(13.5    * 60 * 60).should.equal('14-ю часами ранее')
		// elapsed(14.499  * 60 * 60).should.equal('14-ю часами ранее')
		// elapsed(14.5    * 60 * 60).should.equal('15-ю часами ранее')
		// elapsed(15.499  * 60 * 60).should.equal('15-ю часами ранее')
		// elapsed(15.5    * 60 * 60).should.equal('16-ю часами ранее')
		// elapsed(16.499  * 60 * 60).should.equal('16-ю часами ранее')
		// elapsed(16.5    * 60 * 60).should.equal('17-ю часами ранее')
		// elapsed(17.499  * 60 * 60).should.equal('17-ю часами ранее')
		// elapsed(17.5    * 60 * 60).should.equal('18-ю часами ранее')
		// elapsed(18.499  * 60 * 60).should.equal('18-ю часами ранее')
		// elapsed(18.5    * 60 * 60).should.equal('19-ю часами ранее')
		// elapsed(19.499  * 60 * 60).should.equal('19-ю часами ранее')
		// elapsed(19.5    * 60 * 60).should.equal('20-ю часами ранее')
		// elapsed(20.499  * 60 * 60).should.equal('20-ю часами ранее')
		// elapsed(20.5    * 60 * 60).should.equal('21-ним часами ранее')
		// elapsed(21.499  * 60 * 60).should.equal('21-ним часами ранее')
		// elapsed(21.5    * 60 * 60).should.equal('22-мя часами ранее')
		// elapsed(22.499  * 60 * 60).should.equal('22-мя часами ранее')
		// elapsed(22.5    * 60 * 60).should.equal('23-мя часами ранее')
		// elapsed(23.499  * 60 * 60).should.equal('23-мя часами ранее')
		// elapsed(23.5    * 60 * 60).should.equal('днём ранее')

		// elapsed(1.499   * 24 * 60 * 60).should.equal('днём ранее')
		// elapsed(1.5     * 24 * 60 * 60).should.equal('2-мя днями ранее')
		// elapsed(2.499   * 24 * 60 * 60).should.equal('2-мя днями ранее')
		// elapsed(2.5     * 24 * 60 * 60).should.equal('3-мя днями ранее')
		// elapsed(3.499   * 24 * 60 * 60).should.equal('3-мя днями ранее')
		// elapsed(3.5     * 24 * 60 * 60).should.equal('4-мя днями ранее')
		// elapsed(4.499   * 24 * 60 * 60).should.equal('4-мя днями ранее')
		// elapsed(4.5     * 24 * 60 * 60).should.equal('5-ю днями ранее')
		// elapsed(5.499   * 24 * 60 * 60).should.equal('5-ю днями ранее')
		// elapsed(5.5     * 24 * 60 * 60).should.equal('6-ю днями ранее')
		// elapsed(6.499   * 24 * 60 * 60).should.equal('6-ю днями ранее')
		// elapsed(6.5     * 24 * 60 * 60).should.equal('неделей ранее')

		// elapsed(1.499   * 7 * 24 * 60 * 60).should.equal('неделей ранее')
		// elapsed(1.5     * 7 * 24 * 60 * 60).should.equal('2-мя неделями ранее')
		// elapsed(2.499   * 7 * 24 * 60 * 60).should.equal('2-мя неделями ранее')
		// elapsed(2.5     * 7 * 24 * 60 * 60).should.equal('3-мя неделями ранее')
		// elapsed(3.499   * 7 * 24 * 60 * 60).should.equal('3-мя неделями ранее')
		// elapsed(3.5     * 7 * 24 * 60 * 60).should.equal('месяцем ранее')

		// elapsed(1.499   * 30.44 * 24 * 60 * 60).should.equal('месяцем ранее')
		// elapsed(1.5     * 30.44 * 24 * 60 * 60).should.equal('2-мя месяцами ранее')
		// elapsed(2.499   * 30.44 * 24 * 60 * 60).should.equal('2-мя месяцами ранее')
		// elapsed(2.5     * 30.44 * 24 * 60 * 60).should.equal('3-мя месяцами ранее')
		// elapsed(3.499   * 30.44 * 24 * 60 * 60).should.equal('3-мя месяцами ранее')
		// elapsed(3.5     * 30.44 * 24 * 60 * 60).should.equal('4-мя месяцами ранее')
		// elapsed(4.499   * 30.44 * 24 * 60 * 60).should.equal('4-мя месяцами ранее')
		// elapsed(4.5     * 30.44 * 24 * 60 * 60).should.equal('5-ю месяцами ранее')
		// elapsed(5.499   * 30.44 * 24 * 60 * 60).should.equal('5-ю месяцами ранее')
		// elapsed(5.5     * 30.44 * 24 * 60 * 60).should.equal('полугодом ранее')
		// elapsed(8.999   * 30.44 * 24 * 60 * 60).should.equal('полугодом ранее')
		// elapsed(9       * 30.44 * 24 * 60 * 60).should.equal('годом ранее')

		// elapsed(1.499   * 12 * 30.44 * 24 * 60 * 60).should.equal('годом ранее')
		// elapsed(1.5     * 12 * 30.44 * 24 * 60 * 60).should.equal('2-мя годами ранее')
		// elapsed(2.499   * 12 * 30.44 * 24 * 60 * 60).should.equal('2-мя годами ранее')
		// elapsed(2.5     * 12 * 30.44 * 24 * 60 * 60).should.equal('3-мя годами ранее')
		// elapsed(3.499   * 12 * 30.44 * 24 * 60 * 60).should.equal('3-мя годами ранее')
		// elapsed(3.5     * 12 * 30.44 * 24 * 60 * 60).should.equal('4-мя годами ранее')
		// // ...
		// elapsed(11      * 12 * 30.44 * 24 * 60 * 60).should.equal('11-ю годами ранее')
		// elapsed(21      * 12 * 30.44 * 24 * 60 * 60).should.equal('21-ним годом ранее')
		// elapsed(22      * 12 * 30.44 * 24 * 60 * 60).should.equal('22-мя годами ранее')
		// elapsed(99      * 12 * 30.44 * 24 * 60 * 60).should.equal('99-ю годами ранее')
		// elapsed(100     * 12 * 30.44 * 24 * 60 * 60).should.equal('100 годами ранее')
		// elapsed(101     * 12 * 30.44 * 24 * 60 * 60).should.equal('101-ним годом ранее')
		// elapsed(101.499 * 12 * 30.44 * 24 * 60 * 60).should.equal('101-ним годом ранее')
		// elapsed(101.5   * 12 * 30.44 * 24 * 60 * 60).should.equal('102-мя годами ранее')
	})

	it(`should format time correctly for Russian language (long)`, function()
	{
		react_time_ago.locale('ru', russian_long)

		time_ago = new react_time_ago('ru')
		
		const now = Date.now()
		const elapsed = time => time_ago.format(now + time * 1000, { now })

		elapsed(0     ).should.equal('0 секунд назад')
	})

	it(`should throw an error when an appropriate locale data hasn't been found`, function()
	{
		// ...
	})
})