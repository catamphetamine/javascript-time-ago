import en from '../locale/en'
import ru from '../locale/ru'
import to from '../locale/to'

import RelativeTimeFormat, { loadLocale } from './RelativeTimeFormat'

loadLocale(en)
loadLocale(ru)
loadLocale(to)

describe('Intl.RelativeTimeFormat', () => {
  it('should format relative time', () => {
    const rtf = new RelativeTimeFormat("en");

    expect(rtf.format(-2, "day")).to.equal("2 days ago");
    expect(rtf.format(2.15, "day")).to.equal("in 2.15 days");
    expect(rtf.format(100, "day")).to.equal("in 100 days");

    // "today" is good enough for `0` but is otherwise useless.
    // E.g. consider 23:59:00 or 00:01:00.
    // expect(rtf.format(0, "day")).to.equal("today");
    // expect(rtf.format(-0, "day")).to.equal("today");
  })

  it('should accept an array of locales', () => {
    const rtf = new RelativeTimeFormat(["en"]);
    expect(rtf.format(-2, "day")).to.equal("2 days ago");
  })

  it('should resolve locales as "best fit"', () => {
    const rtf = new RelativeTimeFormat('en-XX');
    expect(rtf.format(-2, "day")).to.equal("2 days ago");
  })

  it('should fallback to default system locale', () => {
    const rtf = new RelativeTimeFormat();
    expect(rtf.format(-2, "day")).to.equal("2 days ago");
  })

  it('should format to parts', () => {
    let rtf = new RelativeTimeFormat("en");

    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "in "},
      { type: "day", value: "100"},
      { type: "literal", value: " days"}
    ]);

    expect(rtf.formatToParts(-100, "day")).to.deep.equal([
      { type: "day", value: "100"},
      { type: "literal", value: " days ago"}
    ]);

    rtf = new RelativeTimeFormat("to");

    expect(rtf.formatToParts(100, "day")).to.deep.equal([
      { type: "literal", value: "ʻi he ʻaho ʻe "},
      { type: "day", value: "100"}
    ]);
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