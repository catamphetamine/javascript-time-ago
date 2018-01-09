import en from '../locale/en'
import ru from '../locale/ru'

import RelativeTimeFormat, { loadLocale } from './RelativeTimeFormat'

loadLocale(en)
loadLocale(ru)

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

  it('should format to parts', () => {
    const rtf = new RelativeTimeFormat("en");

    // expect(rtf.formatToParts(-1, "day")).to.deep.equal([
    //   { type: "literal", value: "yesterday"}
    // ]);

    // expect(rtf.format(100, "day")).to.deep.equal([
    //   { type: "literal", value: "in "},
    //   { type: "day", value: "100"},
    //   { type: "literal", value: " days"}
    // ]);
  })
})