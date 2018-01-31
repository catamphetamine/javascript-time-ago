import en from '../locale/en'
import ru from '../locale/ru'
import to from '../locale/to'

import RelativeTimeFormat, { loadLocale } from './RelativeTimeFormat'

loadLocale(en)
loadLocale(ru)
loadLocale(to)

describe('Intl.RelativeTimeFormat', () => {
  it('should format relative time', () => {
    const rtf = new RelativeTimeFormat("en")

    expect(rtf.format(-1, "day")).to.equal("1 day ago")
    expect(rtf.format(-2, "day")).to.equal("2 days ago")
    expect(rtf.format(2.15, "day")).to.equal("in 2.15 days")
    expect(rtf.format(100, "day")).to.equal("in 100 days")

    // expect(rtf.format(0, "day")).to.equal("today")
    // expect(rtf.format(-0, "day")).to.equal("today")
  })

  it('should throw if a time unit is unsupported', () => {
    const rtf = new RelativeTimeFormat("en")
    expect(() => rtf.format(-1, "decade")).to.throw("Unknown time unit: decade.")
  })

  // it('should format yesterday/today/tomorrow', () => {
  //   const rtf = new RelativeTimeFormat("en")
  //
  //   // "today" is useless for relative time labels.
  //   // E.g. for `23:59:00` "today" is too vague.
  //   // And for `00:01:00` "today" is counter-intuitive.
  //   // "yesterday" and "tomorrow" are also useless for relative time.
  //   // E.g. "yesterday" of `00:01` is misleading.
  //   // Same as "tomorrow" of `23:59` which is misleading too.
  //   // Not to mention that both of them are too "vague", same as "today".
  //   // Also there are no rules defining when to use
  //   // "yesterday", "today" and "tomorrow".
  //   // The algorythm should take local time into account.
  //
  //   expect(rtf.format(-1, "day")).to.equal("yesterday")
  //   expect(rtf.format(0, "day")).to.equal("today")
  //   expect(rtf.format(1, "day")).to.equal("tomorrow")
  // })

  it('should accept an array of locales', () => {
    const rtf = new RelativeTimeFormat(["en"])
    expect(rtf.format(-2, "day")).to.equal("2 days ago")
  })

  it('should resolve locales as "best fit"', () => {
    const rtf = new RelativeTimeFormat('en-XX')
    expect(rtf.format(-2, "day")).to.equal("2 days ago")
  })

  it('should fallback to default system locale', () => {
    const rtf = new RelativeTimeFormat()
    expect(rtf.format(-2, "day")).to.equal("2 days ago")
  })

  it('should format to parts', () => {
    let rtf = new RelativeTimeFormat("en")

    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "in "},
      { type: "day", value: "100"},
      { type: "literal", value: " days"}
    ])

    expect(rtf.formatToParts(-100, "day")).to.deep.equal([
      { type: "day", value: "100"},
      { type: "literal", value: " days ago"}
    ])

    rtf = new RelativeTimeFormat("to")

    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "ʻi he ʻaho ʻe "},
      { type: "day", value: "100"}
    ])
  })

  it('should list supported locales', function() {
    expect(RelativeTimeFormat.supportedLocalesOf(['es-ES', 'ru', 'ru-XX', 'en-GB']))
      .to.deep.equal(['ru', 'ru-XX', 'en-GB'])
  })

  it('should show resolved options', function() {
    expect(new RelativeTimeFormat('ru-XX', { timeZone: 'UTC' }).resolvedOptions()).to.deep.equal({
      locale: "ru"
    })
  })
})