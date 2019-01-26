2.0.0 / 14.01.2018
==================

  * Moved `RelativeTimeFormat` to a separate `relative-time-format` package.

  * (breaking change) Removed `.locale()` static function. Use `.addLocale()` instead.

  * (breaking change) `flavour` property renamed in non-single-word cases: underscores (`_`) got replaced with dashes (`-`). Examples: `short_convenient` -> `short-convenient`, `long_convenient` -> `long-convenient`, `short_time` -> `short-time`, `long_time` -> `long-time`. The relevant keys in locale `index.js` files got renamed the same way.

  * (breaking change) `RelativeTimeFormat` is no longer exported from this library.

  * (could be a breaking change) Re-did `/prop-types`, `/gradation`, `/cache` exports as sub-packages. This could possibly change their import behavior. Maybe `/prop-types` did change — I changed some export strategies for it.

  * (unlikely a breaking change) `yue-Hant` locale removed (due to its removal from CLDR).

  * (unlikely to be a breaking change) Removed handling for a case when "now" unit had "past"/"future" which is an object of quantifier messages instead of a string. The rationale that having "now" unit with "past"/"future" which are objects of quantifier messages wouldn't make sense because "now" is a moment and one can't differentiate between "past moment", "current moment" and "next moment" in real life.

1.0.33 / 29.11.2018
===================

  * Resolved cyclic dependency between `JavascriptTimeAgo.js` and `RelativeTimeFormat.js`.

  * `JavascriptTimeAgo.default_locale` variable no longer exists (it wasn't public or documented).

1.0.32 / 04.11.2018
===================

  * Added `.addLocale()` alias for `.locale()` function (better naming). The old `.locale()` function name is now deprecated and will be removed in some next major version release.

  * Added `RelativeTimeFormat.addLocale()` proxy function which simply calls `JavascriptTimeAgo.addLocale()`.

1.0.19 / 12.01.2018
===================

  * Refactored `twitter` style and styles overall: style can now have `threshold(now)` function and also gradation step can have `format(value, locale)` function instead of `unit`.

1.0.17 / 11.01.2018
===================

  * Renamed `override` to `custom` for styles

1.0.15 / 11.01.2018
===================

  * Renamed `fuzzy` style to `time`.
  * Refactored `gradation`s and `style`s.
  * `gradation` is now not being exported from `index.js` along with `day`, `month` and `year` (one can still `import` it manually from `gradation.js`).
  * `es6` folder got renamed to `modules`
  * `build` folder got renamed to `commonjs`

1.0.11 / 10.01.2018
===================

  * Renamed `plural` to `quantify` inside locale data.
  * Implemented `Intl.RelativeTimeFormat` proposal polyfill which is now being exported.

1.0.10 / 09.01.2018
===================

  * (can be a breaking change for custom styles) Renamed `just-now` unit to `now` and `xxx-concise` flavour to `xxx_time` (+ flavour `.json` files got renamed accordingly).

1.0.8 / 09.01.2018
===================

  * (breaking change) When defining a custom `style` its `override()` function takes `date` and `time` parameters: now `date` parameter of `override()` is not guaranteed to be set (can be inferred from `time`).

1.0.2 / 08.01.2018
===================

  * (breaking change) Due to a long-standing engineering flaw in `intl-messageformat` library (the locale data loading process) I dismissed it and this library is now using raw CLDR locale data instead so built-in locale data now holds an extra property: the `plural` function taking a number and returning the pluralization type of that number ("one", "few", etc). Therefore, if adding raw CLDR locale data for locales which are not built-in this pluralization function must be passed as the second argument to `.locale(localeDataCLDR, pluralsClassifier)`.

  * (breaking change) `javascriptTimeAgo.styles` is no more accesible: pass `style` as a string instead.

  * (breaking change) `locales` folder inside the package renamed to `locale` (e.g. `javascript-time-ago/locales/en` -> `javascript-time-ago/locale/en`).

  * `style.flavour` can now be an array

0.4.4 / 22.12.2016
===================

  * Changed `yesterday` and `tomorrow` labels for Russian localization

0.2.0 / 13.04.2016
===================

  * Moved `intl-messageformat` to `peerDependencies`

0.1.0 / 03.04.2016
===================

  * Initial release