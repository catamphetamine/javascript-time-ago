import JavascriptTimeAgo from './index'
import chooseLocale from './locale'

/**
 * Polyfill for `Intl.RelativeTimeFormat` proposal.
 * https://github.com/tc39/proposal-intl-relative-time
 */
export default class RelativeTimeFormat {
  /**
   * @param {(string|string[])} locales - Preferred locales (or locale).
   * @param {Object} [options] - Formatting options.
   * @param {string} [options.style] - Formatting style (e.g. "long", "short", "narrow").
   */
  constructor(locales, options = {}) {
    const { style } = options
    this.style = style || 'long'

    // Convert `locales` to an array.
    if (typeof locales === 'string') {
      locales = [locales]
    }

    // Choose the most appropriate locale.
    // This could implement some kind of a "best-fit" algorythm.
    this.locale = locales[0]
  }

  /**
   * @param {(string|string[])} locales - Preferred locales (or locale).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @example
   * // Returns "2 days ago"
   * rtf.format(-2, "day")
   * // Returns "in 5 minutes"
   * rtf.format(5, "minute")
   */
  format(value, unit) {
    // Get locale-specific time interval formatting rules
    // of a given `style` for the given value of measurement `unit`.
    //
    // E.g.:
    //
    // ```json
    // {
    //  "past": {
    //    "one": "a second ago",
    //    "other": "{0} seconds ago"
    //  },
    //  "future": {
    //    "one": "in a second",
    //    "other": "in {0} seconds"
    //  }
    // }
    // ```
    //
    // Then choose either "past" or "future" based on time `value` sign.
    const rules = getLocaleData(this.locale)[this.style][unit][value <= 0 ? 'past' : 'future']
    // Quantify `value`.
    const quantifier = getLocaleData(this.locale).plural(Math.abs(value))
    // "other" rule is supposed to always be present
    const rule = rules[quantifier] || rules.other
    // Format the `value`
    return rule.replace('{0}', Math.abs(value))
  }

  /**
   * @param {(string|string[])} locales - Preferred locales (or locale).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @example
   * // Returns [
   * //   { type: "literal", value: "in "},
   * //   { type: "day", value: "100"},
   * //   { type: "literal", value: " days"}
   * // ]
   * rtf.format(100, "day")
   */
  // formatToParts(value, unit) {
  //   ...		
  // }
}

export function loadLocale(locale) {
  JavascriptTimeAgo.locale(locale)
}

function getLocaleData(locale) {
  return JavascriptTimeAgo.locales[locale]
}