import en from '../locale/en'
import ru from '../locale/ru'
import to from '../locale/to'

import RelativeTimeFormat from './RelativeTimeFormat'

RelativeTimeFormat.addLocale(en)
RelativeTimeFormat.addLocale(ru)
RelativeTimeFormat.addLocale(to)

describe('Intl.RelativeTimeFormat', () => {
  it('should validate options', () => {
    expect(() => new RelativeTimeFormat("en", { style: "postmodern" })).to.throw("Invalid \"style\" option")
    expect(() => new RelativeTimeFormat("en", { numeric: "sometimes" })).to.throw("Invalid \"numeric\" option")
  })

  it('should format relative time', () => {
    const rtf = new RelativeTimeFormat("en")

    expect(rtf.format(-1, "day")).to.equal("1 day ago")
    expect(rtf.format(-2, "day")).to.equal("2 days ago")
    expect(rtf.format(2.15, "day")).to.equal("in 2.15 days")
    expect(rtf.format(100, "day")).to.equal("in 100 days")
  })

  it('should throw if a time unit is unsupported', () => {
    const rtf = new RelativeTimeFormat("en")
    expect(() => rtf.format(-1, "decade")).to.throw("Unknown time unit: decade.")
  })

  it('should format yesterday/today/tomorrow (version 2)', () => {
    RelativeTimeFormat.useVersion(2)

    const rtf = new RelativeTimeFormat("en", { numeric: "auto" })

    // "today" is useless for relative time labels.
    // E.g. for `23:59:00` "today" is too vague.
    // And for `00:01:00` "today" is counter-intuitive.
    // "yesterday" and "tomorrow" are also useless for relative time.
    // E.g. "yesterday" of `00:01` is misleading.
    // Same as "tomorrow" of `23:59` which is misleading too.
    // Not to mention that both of them are too "vague", same as "today".
    // Also there are no rules defining when to use
    // "yesterday", "today" and "tomorrow".
    // The algorithm should take local time into account.

    expect(rtf.format(-1, "day")).to.equal("yesterday")
    expect(rtf.format(0, "day")).to.equal("today")
    expect(rtf.format(1, "day")).to.equal("tomorrow")

    RelativeTimeFormat.useVersion(1)
  })

  it('shouldn\'t format yesterday/today/tomorrow when there\'s no locale data (version 2)', () => {
    RelativeTimeFormat.useVersion(2)

    const enLongDay = { ...en.long.day }
    delete en.long.day.previous
    delete en.long.day.current
    delete en.long.day.next

    const rtf = new RelativeTimeFormat("en", { numeric: "auto" })

    // "today" is useless for relative time labels.
    // E.g. for `23:59:00` "today" is too vague.
    // And for `00:01:00` "today" is counter-intuitive.
    // "yesterday" and "tomorrow" are also useless for relative time.
    // E.g. "yesterday" of `00:01` is misleading.
    // Same as "tomorrow" of `23:59` which is misleading too.
    // Not to mention that both of them are too "vague", same as "today".
    // Also there are no rules defining when to use
    // "yesterday", "today" and "tomorrow".
    // The algorithm should take local time into account.

    expect(rtf.format(-1, "day")).to.equal("1 day ago")
    expect(rtf.format(0, "day")).to.equal("0 days ago")
    expect(rtf.format(1, "day")).to.equal("in 1 day")

    RelativeTimeFormat.useVersion(1)

    en.long.day = enLongDay
  })

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
      { type: "literal", value: "in " },
      { type: "day", value: "100" },
      { type: "literal", value: " days" }
    ])

    expect(rtf.formatToParts(-100, "day")).to.deep.equal([
      { type: "day", value: "100" },
      { type: "literal", value: " days ago" }
    ])

    // Tonga (Tonga Islands)
    rtf = new RelativeTimeFormat("to")
    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "ʻi he ʻaho ʻe " },
      { type: "day", value: "100" }
    ])
  })

  it('should format to parts (version 2)', () => {
    RelativeTimeFormat.useVersion(2)

    let rtf = new RelativeTimeFormat("en")

    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "in " },
      { type: "integer", value: "100", unit: "day" },
      { type: "literal", value: " days" }
    ])

    RelativeTimeFormat.useVersion(1)
  })

  it('should format to parts with numeric="auto" (version 2)', () => {
    RelativeTimeFormat.useVersion(2)

    const rtf = new RelativeTimeFormat("en", { numeric: "auto" })

    expect(rtf.formatToParts(-1, "day")).to.deep.equal([
      { type: "literal", value: "yesterday" }
    ])

    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "in " },
      { type: "integer", value: "100", unit: "day" },
      { type: "literal", value: " days" }
    ])

    RelativeTimeFormat.useVersion(1)
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