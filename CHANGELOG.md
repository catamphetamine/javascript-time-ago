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