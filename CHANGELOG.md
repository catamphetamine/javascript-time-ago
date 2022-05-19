<!--
TO DO: Maybe change from string style names to configurable style options. Example: twitter-minute-now -> "twitter", { startFrom: 'minute', now: true }. twitter-first-minute -> "twitter", { startFrom: 'minute', startFromValue: 1 }.

TO DO: Maybe require `minTime` on all steps (except the first one).

TO DO: Remove the legacy compatibility of getting "now" label from "long.second.current" in runtime code (not in locale generation code — that one's as intended).

TO DO: Obtaining "now" label in runtime when not using the polyfill:

```js
new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(0, 'second')
// Outputs "now".
```

TO DO: Remove deprecated `tiny` locale labels.

TO DO: Remove "defaultLocale = 'en'": a developer will have to specify their own default locale.

TO DO: Maybe create a "dummy" `time-ago-js` package that would simply re-export `javascript-time-ago`.

TO DO: Added the ability to use native `Intl.RelativeTimeFormat` instead of the polyfill.

TO DO: (maybe, or maybe not) Steps' `format()` function now always receives a `Date` as the first argument (or maybe a `number` timestamp is better for most cases).

TO DO: Maybe remove `granularity` property of steps ("Perhaps this feature will be removed because there seem to be no use cases of it in the real world" in the readme).

TO DO: Change default style to "round".

TO DO: Maybe remove `style.units` parameter.

TO DO: "time" style should use "round" scale instead of "approximate".

TO DO: if `style` is passed as an object then maybe it should be passed as part of `options` (and document that in the "Custom" section of the readme).
-->

2.4.0 / 19.05.2022
==================

* Moved the package to use "ES Modules" exports.

2.3.13 / 11.02.2022
==================

[Fixed](https://github.com/catamphetamine/javascript-time-ago/issues/60) the CDN bundle `javascript-time-ago.js` when it exported the `TimeAgo` class as a `default` property instead of exporting the `TimeAgo` class itself.

2.3.6 / 25.05.2021
==================

* [Added](https://github.com/catamphetamine/javascript-time-ago/pull/47) `mini` style (aka `twitter` style) for some locales: `da`, `sv`, `nl`, `it`, `fr`, `es`. By [@trustpilot](https://github.com/trustpilot).

2.3.5 / 12.05.2021
==================

* Added [additional `pt` locale styles](https://github.com/catamphetamine/javascript-time-ago/pull/45) by [Victor Biasibetti](https://github.com/victorbiasibetti).

2.3.3 / 11.11.2020
==================

* Changed the default `style` from `"approximate"` (legacy) to `"round-minute"`. This isn't a "breaking change" because no application would be "broken" by something like that, and relative time would still be shown in a similar way, only without too much approximation.

2.3.1 / 20.10.2020
==================

* (advanced) Renamed `getMinTimeToFrom()` to `getMinTimeForUnit()`.

2.3.0 / 14.10.2020
==================

* `test(timestamp)` function of a step is now deprecated. Use `minTime(timestamp)` function instead.

* Fixed `getTimeToNextUpdate()`.

* Renamed `"mini-time"` labels to `"mini"`.

* Added styles: `"mini"`, `"mini-now"`, `"mini-minute"`, `"mini-minute-now"`.

* Added a new `round` property (described in the readme): it can be `"round"` or `"floor"`. The default is `"round"`.

* (Could be a breaking change for those who read `"tiny"` from JSON files directly) Removed "tiny" labels from JSON files. `"tiny"` labels type name still works.

2.2.9 / 14.10.2020
==================

* Fixed `"twitter-..."` styles.

2.2.8 / 12.10.2020
==================

* Added `"twitter-minute-now"` style.

* The threshold for `"now"` -> `"1m"`/`"1 minute ago"` is now 30 seconds rather than 40 seconds.

2.2.6 / 12.10.2020
==================

* Changed `"twitter"` style: doesn't output `"now"` for 0 seconds.

* Added `"twitter-now"` style that outputs `"now"` for 0 seconds.

2.2.5 / 11.10.2020
==================

* Added `addDefaultLocale()` static function (similar to `addLocale()` but also calls `setDefaultLocale()`).

* `"twitter"` style used to output `"now"` for 0 seconds. Then it was changed to `"0s"`. Now it has been [changed](https://github.com/catamphetamine/javascript-time-ago/issues/38) to `"now"` again.

* Added "CDN" section in the readme that documents using the library with `<script/>` tags (without a bundler).

2.2.0 / 09.10.2020
==================

* Renamed steps' `unit` to `formatAs`. The older name still works. Maybe it will be renamed to something else in some future.

* Renamed steps' `threshold` to `minTime`. The older name still works but is considered deprecated.

* Renamed steps' `threshold_for_idOrUnit: value` to `minTime: { id: value }`. The older way still works but is considered deprecated. Maybe `minTime: {}` object will be deprecated too in some future.

* Added `test(date, { now, future })` function to steps: it can be an alternative to `minTime`. See "twitter" style for an example.

* Added a third argument to steps' `format()` function: an object having shape `{ formatAs(unit, value): string, future: boolean }`.

* Added `TimeAgo.addLabels(locale, name, labels)` function, that can be used to expand localized time labels.

* Added `"twitter-first-minute"` style: same as `"twitter"` but doesn't output anything before the first minute. This is how `"twitter"` style worked initially.

* Added `getTimeToNextUpdate` feature (see README).

* Updated `relative-time-format` to the latest version: `0.1.x` -> `1.0.0`.

* Locale files are now `*.json` files. There's no `quantify` function there now: now it's just labels. `{locale}/index.js` files are still there just for legacy compatibility.

* Added the ability to use native [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) and [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) instead of the polyfills: in this case, pass `polyfill: false` option when creating a `TimeAgo` instance.

* The bundle is now generated by Rollup rather than Webpack.

2.1.5 / 07.10.2020
==================

* Custom styles: renamed `gradation` to `steps` and `flavour` to `labels`. The older names still work but are considered deprecated.

* `factor` property of a "step" is now not required: if not present, it's assumed equal to the `unit` in seconds (for example, the default `factor` is `60 * 60` for `unit: "hour"`).

2.1.4 / 06.10.2020
==================

* Renamed `"default"` style to `"round"`. The older name still works but is considered deprecated.

* Added `"round-minute"` style: same as `"round"` but without seconds.

* Renamed `"time"` style to `"approximate-time"`. The older name still works but is considered deprecated.

* Renamed `"canonical"` gradation to `"round"`. The older name still works but is considered deprecated.

* Renamed `"tiny"` time labels style to `"mini-time"`. `"tiny"` time labels style still works but is considered deprecated.

* (internals) Renamed `tiny.json` locale files to `mini-time.json`. Removed `now` unit from `mini-time.json`.

* (internals) `"approximate"` (previously `"convenient"`) style now uses `long` labels instead of `long-convenient.json`.

* (internals) Removed `now` unit from `mini-time.json` files.

* (internals) Removed `long-convenient.json` and `short-convenient.json` files: `long.json` and `short.json` in combination with `now.json` are used instead.

2.1.0 / 05.10.2020
==================

* (could be considered a breaking change, but it doesn't actually break any apps) `"twitter"` style now outputs something like `"1s"` in case of `"1 second ago"`. Previously it didn't output anything when the time difference was less than a minute. The rationale for the change is that Twitter actually does output seconds when the time difference is less than a minute. There's still a small difference from Twitter: Twitter outputs `"now"` in case of `"0 seconds ago"` while this library outputs `"0s"` — the rationale is that "now" could be too long is different languages, and also it would look too contrasty compared to its "sibling" `"Xs"` time labels.

* Added `"default"` style (`long` time labels + `canonical` gradation). Update: it's now called `"round"` instead of `"default"`.

* Added `future` option on `.format(value, style, options)` function: it determines, whether to use the `"future"` variant of `"now"` when formatting `0` time difference. By default, it uses the `"past"` variant of `"now"` when formatting `0` time difference: `"just now"` instead of `"in a moment"`.

* (miscellaneous) Added dedicated `"now.json"` labels for `"now"` time unit.

2.0.10 / 16.07.2020
==================

* Added `"tiny"` time labels for `"de"` locale.

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
