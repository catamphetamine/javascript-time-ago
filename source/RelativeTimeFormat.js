import JavascriptTimeAgo from './JavascriptTimeAgo'

/**
 * Polyfill for `Intl.RelativeTimeFormat` proposal.
 * https://github.com/tc39/proposal-intl-relative-time
 * https://github.com/tc39/proposal-intl-relative-time/issues/55
 */
export default class RelativeTimeFormat {
  /**
   * @param {(string|string[])} [locales] - Preferred locales (or locale).
   * @param {Object} [options] - Formatting options.
   * @param {string} [options.style="long"] - One of: "long", "short", "narrow".
   * @param {string} [options.type="numeric"] - One of: "numeric", "text".
   * @param {string} [options.localeMatcher="best fit"] - One of: "lookup", "best fit".
   */
  constructor(locales, options = {}) {
    const { style } = options
    this.style = style || 'long'

    // Choose the most appropriate locale.
    // This could implement some kind of a "best-fit" algorythm.
    if (locales) {
      this.locale = RelativeTimeFormat.supportedLocalesOf(locales)[0]
    }
    this.locale = this.locale ? resolveLocale(this.locale) : getDefaultLocale()
  }

  /**
   * Formats time `value` in `units` (either in past or in future).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {string}
   * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
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
   * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
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
   * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
   * @example
   * // Returns "{0} days ago"
   * getRule(-2, "day")
   */
  getRule(value, unit) {
    // "now" is used in `javascript-time-ago`.
    if (["now", "second", "minute", "hour", "day", "week", "month", "quarter", "year"].indexOf(unit) < 0) {
      throw new RangeError(`Unknown time unit: ${unit}.`)
    }
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
    const unitRules = getLocales()[this.locale][this.style][unit]
    if (typeof unitRules === "string") {
      return unitRules
    }
    // Choose either "past" or "future" based on time `value` sign.
    // If "past" is same as "future" then they're stored as "other".
    // If there's only "other" then it's being collapsed.
    const quantifierRules = unitRules[value <= 0 ? "past" : "future"] || unitRules
    if (typeof quantifierRules === "string") {
      return quantifierRules
    }
    // Quantify `value`.
    const quantify = getLocales()[this.locale].quantify
    let quantifier = quantify && quantify(Math.abs(value))
    // There seems to be no such locale in CLDR
    // for which `quantify` is missing
    // and still `past` and `future` messages
    // contain something other than "other".
    /* istanbul ignore next */
    quantifier = quantifier || 'other'
    // "other" rule is supposed to always be present.
    // If only "other" rule is present then "rules" is not an object and is a string.
    return quantifierRules[quantifier] || quantifierRules.other
  }

  /**
   * Returns a new object with properties reflecting the locale and date and time formatting options computed during initialization of this DateTimeFormat object.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions
   * @return {Object}
   */
  resolvedOptions() {
    return {
      locale: this.locale
    }
  }
}

/**
 * Returns an array containing those of the provided locales
 * that are supported in collation without having to fall back
 * to the runtime's default locale.
 * @param {(string|string[])} locale - A string with a BCP 47 language tag, or an array of such strings. For the general form of the locales argument, see the Intl page.
 * @param {Object} [options] - An object that may have the following property:
 * @param {Function} [options.localeMatcher] - The locale matching algorithm to use. Possible values are "lookup" and "best fit"; the default is "best fit". For information about this option, see the Intl page.
 * @return {string[]} An array of strings representing a subset of the given locale tags that are supported in collation without having to fall back to the runtime's default locale.
 * @example
 * var locales = ['ban', 'id-u-co-pinyin', 'de-ID'];
 * var options = { localeMatcher: 'lookup' };
 * console.log(Intl.RelativeTimeFormat.supportedLocalesOf(locales, options).join(', '));
 * // → "id-u-co-pinyin, de-ID"
 */
RelativeTimeFormat.supportedLocalesOf = function(locales, options) {
  // Convert `locales` to an array.
  if (typeof locales === 'string') {
    locales = [locales]
  }
  // This is not an intelligent algorythm,
  // but it will do for the polyfill purposes.
  // This could implement some kind of a "best-fit" algorythm.
  return locales.filter(resolveLocale)
}

/**
 * Resolves a locale to a supported one.
 * @param  {string} locale
 * @return {string}
 */
function resolveLocale(locale) {
  if (getLocales()[locale]) {
    return locale
  }
  // `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
  const parts = locale.split('-')
  while (locale.length > 1) {
    parts.pop()
    locale = parts.join('-')
    if (getLocales()[locale]) {
      return locale
    }
  }
}

export function loadLocale(locale) {
  JavascriptTimeAgo.locale(locale)
}

function getLocales() {
  return JavascriptTimeAgo.locales
}

function getDefaultLocale() {
  return JavascriptTimeAgo.default_locale
}

/**
 * Extracts language from an IETF BCP 47 language tag.
 * @param {string} languageTag - IETF BCP 47 language tag.
 * @return {string}
 * @example
 * // Returns "he"
 * getLanguageFromLanguageTag("he-IL-u-ca-hebrew-tz-jeruslm")
 * // Returns "ar"
 * getLanguageFromLanguageTag("ar-u-nu-latn")
 */
// export function getLanguageFromLanguageTag(languageTag) {
//   const hyphenIndex = languageTag.indexOf('-')
//   if (hyphenIndex > 0) {
//     return languageTag.slice(0, hyphenIndex)
//   }
//   return languageTag
// }