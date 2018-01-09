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
    this.locale = chooseLocale(
      locales,
      getLocales()
    )
  }

  /**
   * Formats time `value` in `units` (either in past or in future).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {string}
   * @example
   * // Returns "2 days ago"
   * rtf.format(-2, "day")
   * // Returns "in 5 minutes"
   * rtf.format(5, "minute")
   */
  format(value, unit) {
    return this.getRule(value, unit).replace('{0}', Math.abs(value))
  }

  /**
   * Formats time `value` in `units` (either in past or in future).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {Object[]} The parts (`{ type, value }`).
   * @example
   * // Returns [
   * //   { type: "literal", value: "in "},
   * //   { type: "day", value: "100"},
   * //   { type: "literal", value: " days"}
   * // ]
   * rtf.formatToParts(100, "day")
   */
  formatToParts(value, unit) {
    const rule = this.getRule(value, unit)
    const valueIndex = rule.indexOf("{0}")
    const parts = []
    let pre
    let post
    if (valueIndex > 0) {
      parts.push({
        type: "literal",
        value: rule.slice(0, valueIndex)
      })
    }
    parts.push({
      type: unit,
      value: String(Math.abs(value))
    })
    if (valueIndex + "{0}".length < rule.length - 1) {
      parts.push({
        type: "literal",
        value: rule.slice(valueIndex + "{0}".length)
      })
    }
    return parts
  }

  /**
   * Returns formatting rule for `value` in `units` (either in past or in future).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {string}
   * @example
   * // Returns "{0} days ago"
   * getRule(-2, "day")
   */
  getRule(value, unit) {
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
    const rules = getLocales()[this.locale][this.style][unit][value <= 0 ? "past" : "future"]
    // Quantify `value`.
    const quantifier = getLocales()[this.locale].quantify(Math.abs(value))
    // "other" rule is supposed to always be present
    return rules[quantifier] || rules.other
  }
}

export function loadLocale(locale) {
  JavascriptTimeAgo.locale(locale)
}

function getLocales() {
  return JavascriptTimeAgo.locales
}