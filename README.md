# javascript-time-ago

[![npm version](https://img.shields.io/npm/v/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![npm downloads](https://img.shields.io/npm/dm/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![coverage](https://img.shields.io/coveralls/catamphetamine/javascript-time-ago/master.svg?style=flat-square)](https://coveralls.io/r/catamphetamine/javascript-time-ago?branch=master)

Intelligent, international, higly customizable relative date/time formatter (both for past and future dates).

Automatically chooses the right units (seconds, minutes, etc) to format a time interval.

Examples:

  * just now
  * 45s
  * 5m
  * 15 minutes ago
  * 3 hours ago
  * in 2 months
  * in 5 years
  * …

For React users, there's a [React component](https://catamphetamine.gitlab.io/react-time-ago/).

This is a readme for version `2.x`. For older versions, [see version `1.x` readme](https://github.com/catamphetamine/javascript-time-ago/tree/1.x). See a [migration guide](https://github.com/catamphetamine/javascript-time-ago/blob/master/MIGRATION.md) for migrating from version `1.x` to version `2.x`.

## Install

```
npm install javascript-time-ago --save
```

## Use

```js
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules and labels.
import en from 'javascript-time-ago/locale/en'

// Add locale-specific relative date/time formatting rules and labels.
TimeAgo.addLocale(en)

// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US')

// Format relative date/time using "round" style.

timeAgo.format(new Date(), 'round')
// "just now"

timeAgo.format(Date.now() - 15 * 1000, 'round')
// "15 seconds ago"

timeAgo.format(Date.now() - 60 * 1000, 'round')
// "1 minute ago"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000, 'round')
// "2 hours ago"

timeAgo.format(Date.now() - 24 * 60 * 60 * 1000, 'round')
// "1 day ago"
```

## Locales

This library includes date/time formatting rules and labels for any language.

No languages are loaded default: a developer must manually choose which languages should be loaded. The languages should be imported from `javascript-time-ago/locale` and then added via `TimeAgo.addLocale(...)`. An example of using Russian language:

<!--
If the resulting bundle size is of no concern (for example, when building a big enterprise application), or if the code is being run on server side (Node.js), then one can use this helper to load all available locales:

```js
require('javascript-time-ago/load-all-locales')
```
-->

```js
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules and labels.
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

// Add locale-specific relative date/time formatting rules and labels.
// "en" is the default (fallback) locale.
// (that could be changed via `TimeAgo.setDefaultLocale(...)`)
TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

// cyka blyat
const timeAgo = new TimeAgo('ru-RU')

timeAgo.format(new Date(), 'round')
// "только что"

timeAgo.format(Date.now() - 15 * 1000, 'round')
// "15 секунд назад"

timeAgo.format(Date.now() - 60 * 1000, 'round')
// "1 минуту назад"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000, 'round')
// "2 часа назад"

timeAgo.format(Date.now() - 24 * 60 * 60 * 1000, 'round')
// "1 день назад"
```

## Styles

This library allows for any custom logic for formatting time interval labels:

* What scale should be used for measuring time intervals: should it be precise down to the second, or should it only measure it up to a minute, or should it start from being more precise when time intervals are small and then gradually decrease its precision as time intervals get larger.

* What labels should be used: should it use the standard built-in labels for the languages (`"... minutes ago"`, `"... min. ago"`, `"...m"`), or should it use custom ones, or should it skip using relative time labels in some cases and instead output something like `"Dec 11, 2015"`.

Such configuration comes under the name of "style".

While a completely [custom](#custom) style could be supplied, this library comes with several [built-in ](https://github.com/catamphetamine/javascript-time-ago/tree/master/source/style) styles that some people might find useful.

### Round

Rounds the time up to the closest time measurement unit (second, minute, hour, etc).

```js
timeAgo.format(Date.now(), 'round')
// 0 seconds ago → "just now"

timeAgo.format(Date.now() - 15 * 1000, 'round')
// 15 seconds ago → "15 seconds ago"

timeAgo.format(Date.now() - 1.5 * 60 * 1000, 'round')
// 1.5 minutes ago → "2 minutes ago"
```

  * just now
  * 1 second ago
  * 2 seconds ago
  * …
  * 59 seconds ago
  * 1 minute ago
  * 2 minutes ago
  * …
  * 59 minutes ago
  * 1 hour ago
  * 2 hours ago
  * …
  * 59 hours ago
  * 1 day ago
  * 2 days ago
  * …
  * 6 days ago
  * 1 week ago
  * 2 weeks ago
  * 3 weeks ago
  * 1 month ago
  * 2 months ago
  * …
  * 11 months ago
  * 1 year ago
  * 2 years ago
  * …

<!-- For historical reasons, it's not the style that's used when no `style` argument is passed (this will be changed in the next major version). -->

### Round (minute)

Same as `"round"` but without seconds.

```js
timeAgo.format(Date.now(), 'round-minute')
// 0 seconds ago → "just now"

timeAgo.format(Date.now() - 15 * 1000, 'round-minute')
// 15 seconds ago → "just now"

timeAgo.format(Date.now() - 1.5 * 60 * 1000, 'round-minute')
// 1.5 minutes ago → "2 minutes ago"
```

  * just now
  * 1 minute ago
  * 2 minutes ago
  * …
  * 59 minutes ago
  * 1 hour ago
  * 2 hours ago
  * …
  * 59 hours ago
  * 1 day ago
  * 2 days ago
  * …
  * 6 days ago
  * 1 week ago
  * 2 weeks ago
  * 3 weeks ago
  * 1 month ago
  * 2 months ago
  * …
  * 11 months ago
  * 1 year ago
  * 2 years ago
  * …

### Approximate

`"approximate"` style is a legacy one that has been introduced in the early versions of this library. It's the same as `"round"` with the difference that it rounds time in some cases:

* `just now` → `just now`
* `40 seconds ago` → `just now`
* `45 seconds ago` → `1 minute ago`
* `5 minutes ago` → `5 minutes ago`
* `6 minutes ago` → `5 minutes ago`
* `7 minutes ago` → `5 minutes ago`
* `8 minutes ago` → `10 minutes ago`
* `9 minutes ago` → `10 minutes ago`
* `10 minutes ago` → `10 minutes ago`
* …

```js
timeAgo.format(Date.now(), 'approximate')
// 0 seconds ago → "just now"

timeAgo.format(Date.now() - 15 * 1000, 'approximate')
// 15 seconds ago → "just now"

timeAgo.format(Date.now() - 1.5 * 60 * 1000, 'approximate')
// 1.5 minutes ago → "2 minutes ago"

timeAgo.format(Date.now() - 3 * 60 * 1000, 'approximate')
// 3 minutes ago → "5 minutes ago"
```

  * just now
  * 1 minute ago
  * 2 minutes ago
  * 5 minutes ago
  * 10 minutes ago
  * 15 minutes ago
  * 20 minutes ago
  * …
  * 50 minutes ago
  * 1 hour ago
  * 2 hours ago
  * …
  * 20 hours ago
  * 1 day ago
  * 2 days ago
  * …
  * 5 days ago
  * 1 week ago
  * 2 weeks ago
  * 3 weeks ago
  * 1 month ago
  * 2 months ago
  * …
  * 10 months ago
  * 1 year ago
  * 2 years ago
  * …

For historical reasons, `"approximate"` style is the one that's used when no `style` argument is passed (this will be changed in the next major version: `round` or `round-minute` will be the default one).

### Approximate (time)

`"approximate-time"` style is a legacy one that has been introduced in the early versions of this library. It's the same as the `"approximate"` but without the "ago" part.

```js
timeAgo.format(Date.now(), 'approximate-time')
// 0 seconds ago → "just now"

timeAgo.format(Date.now() - 15 * 1000, 'approximate-time')
// 15 seconds ago → "just now"

timeAgo.format(Date.now() - 1.5 * 60 * 1000, 'approximate-time')
// 1.5 minutes ago → "2 minutes"

timeAgo.format(Date.now() - 3 * 60 * 1000, 'approximate-time')
// 3 minutes ago → "5 minutes"
```

  * just now
  * 1 minute
  * 2 minutes
  * 5 minutes
  * 10 minutes
  * 15 minutes
  * 20 minutes
  * …
  * 50 minutes
  * 1 hour
  * 2 hours
  * …
  * 20 hours
  * 1 day
  * 2 days
  * …
  * 5 days
  * 1 week
  * 2 weeks
  * 3 weeks
  * 1 month
  * 2 months
  * …
  * 10 months
  * 1 year
  * 2 years
  * …

__Not all locales are applicable for this style__: only [those](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) having `long-time.json`.

### Twitter

Mimics [Twitter](https://twitter.com) style of "time ago" labels (`"1s"`, `"2m"`, `"3h"`, `"Mar 4"`, `"Apr 5, 2012"`)

```js
timeAgo.format(new Date(), 'twitter')
// 0 seconds ago → "0s"

timeAgo.format(new Date() - 1, 'twitter')
// 1 second ago → "1s"

timeAgo.format(Date.now() - 1.5 * 60 * 1000, 'twitter')
// 1.5 minutes ago → "2m"

timeAgo.format(Date.now() - 3.5 * 60 * 60 * 1000, 'twitter')
// 3.5 hours ago → "4h"

timeAgo.format(Date.now() - 4 * 24 * 60 * 60 * 1000, 'twitter')
// More than 24 hours ago → `month/day` ("Mar 4")

timeAgo.format(Date.now() - 364 * 24 * 60 * 60 * 1000, 'twitter')
// Another year → `month/day/year` ("Mar 5, 2017")
```

`"twitter"` style uses [`Intl`](https://gitlab.com/catamphetamine/relative-time-format#intl) for formatting `day/month/year` labels. If `Intl` is not available (for example, in Internet Explorer), it falls back to the default labels for month/year intervals: `"1 mo. ago"`/`"1 yr. ago"`.

__Not all locales are applicable for this style__: only [those](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) having `mini-time.json` time labels.

## Custom

This library comes with several built-in ["styles"](#styles), a "style" being an object defining `labels` and `steps`. A custom "style" object may be passed as a second parameter to `.format(date, style)` function.

### Labels

The time labels variant used for generating output. Is `"long"` by default (`"1 minute ago"`). Can be either a string, or an array of strings, in which case each one of them is tried until a supported one is found. For example, `["mini-time", "short"]` will search for `"mini-time"` labels first and then fall back to `"short"` labels if `"mini-time"` labels aren't defined for the language. `"long"`, `"short"` and `"narrow"` time labels are always present for each language. Other time label variants like `"mini-time"` are only defined for a [small subset](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) of languages.

Relative date/time labels come in various styles: `long`, `short`, `narrow` (these three are the standard [CLDR](http://cldr.unicode.org/) ones that're always present), possibly accompanied by others like `mini-time` (`"1m"`, `"2h"`, ...). Refer to [`locale/en`](https://github.com/catamphetamine/javascript-time-ago/blob/master/locale/en) for an example.

```js
import english from 'javascript-time-ago/locale/en'

english['mini-time']  // '1s', '2m', '3h', '4d', …
english.narrow // '1 sec. ago', '2 min. ago', …
english.short // '1 sec. ago', '2 min. ago', …
english.long  // '1 second ago', '2 minutes ago', …
```

* `mini-time` is supposed to be the shortest one possible. It's not a CLDR-defined one and has been defined only for a small subset of languages (`en`, `ru`, `ko`, and several others).

* `narrow` is a CLDR-defined one and is intended to be shorter than `short`, or at least no longer than it. I personally find `narrow` a weird one because for some locales it's the same as `short` and for other locales it's a really weird one (e.g. for Russian).

* `short` is "short".

* `long` is the normal one.

### Steps

Time interval measurement "steps".

Each "step"'s `threshold` (in seconds) is tested until the farthest eligible step is found, and that "step" is then used to generate output. If no eligible `step` is found, then an empty string is returned.

`"round"` style `steps` example:

```js
[
  {
    // "second" labels are used for formatting the output.
    unit: 'second'
  },
  {
    // "minute" labels are used for formatting the output.
    unit: 'minute'
    // This step is effective starting from 59.5 seconds.
    threshold: 59.5
  },
  {
    // "hour" labels are used for formatting the output.
    unit: 'hour',
    // This step is effective starting from 59.5 minutes.
    threshold: 59.5 * 60
  },
  …
]
```

Each step is described by:

  * `unit` — A time measurement unit the labels for which are used to generate the output of this step. If the `unit` isn't supported by the language, then the step is ignored. The time units supported in all languages are: `second`, `minute`, `hour`, `day`, `week`, `quarter`, `month`, `year`. For [some languages](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles), this library also defines `now` unit (`"just now"`).

  <!-- * `factor` — A divider for the time interval value which is in seconds. For example, if `unit` is `"seconds"` then `factor` should be `1`, and if `unit` is `"minutes"` then `factor` should be `60` because to get the amount of minutes one should divide the amout of seconds by `60`. This `factor` property is actually a redundant one and can be derived from `unit` so it will be removed in the next major version. -->

  * `threshold` — A minimum time interval (in seconds) required for this step, meaning that `threshold` controls the progression from one step to another. Each step must have a `threshold` defined, except for the first one. It can be a `number` or a `function(now: number, future: boolean): number`. In some advanced cases, like when using `now` unit (which is only defined for a few languages), one could use a `threshold_for_[unit]` override that would take priority over `threshold` when the previous step's `unit` is `[unit]` (see [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/approximate.js) steps for an example).

  <!--   * `granularity` — (advanced) Time interval value "granularity". For example, it could be set to `5` for minutes to allow only 5-minute increments when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc. Perhaps this feature will be removed because there seem to be no use cases of it in the real world. -->

It's also possible for a step to not just output a time interval in certain time units but instead return any custom output, in which case it should be defined using:

 * `threshold` — Same as above.

 * `format` — A `function(value: Date/number, locale: string)` returning a `string`. The `value` argument is the date/time being formatted, as passed to `timeAgo.format(value)` function: either a `number` or a `Date`. The `locale` argument is the selected locale (aka "BCP 47 language tag", like `"ru-RU"`). For example, `"twitter"` style "steps" consists of generic `second`, `minute` and `hour` steps, followed by a step with a `format()` function that formats a date as `"day/month/year"` (like `Jan 24, 2018`).

Built-in `steps`:

```js
import { round, approximate } from 'javascript-time-ago/steps'
```

* [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/approximate.js) — These're, for historical reasons, the default `steps`. Are used in [`"approximate"`] style.

* [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/round.js) — Are used in [`"round"`] style.

The `/steps` export also provides some utility time unit values that can be used in `threshold`s of custom `steps`:

```js
import { minute, hour, day, week, month, year } from 'javascript-time-ago/steps'

// in seconds
minute === 60
hour === 60 * 60
day === 24 * 60 * 60
...
```

<!--
### Units

A list of allowed time interval measurement units. Example: `["second", "minute", "hour", ...]`. By default, all available units are defined. This property can be used to filter out some of the non-conventional time units like `"quarter"` which is present in [CLDR](http://cldr.unicode.org/) data. -->

## Future

When given future dates, `.format()` produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

## Default

The default locale is `en` and can be changed: `TimeAgo.setDefaultLocale('ru')`.

<!--
## Caching

Constructing a new `JavascriptTimeAgo` class instance is assumed to be a potentially lengthy operation (even though in reality it isn't). One can use the exported `Cache` class for caching.

```js
import Cache from 'javascript-time-ago/Cache'

const cache = new Cache()
const object = cache.get('key1', 'key2', ...) || cache.put('key1', 'key2', ..., createObject())
```
-->

## Localization internals

This library uses a [`Intl.RelativeTimeFormat`](https://github.com/catamphetamine/relative-time-format) polyfill under the hood.

## React

There is also a [React component](https://catamphetamine.gitlab.io/react-time-ago/) built upon this library, that autorefreshes itself.

## Intl

(this is an "advanced" section)

[`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object is not required for this library, but, for example, if you choose to use the built-in `twitter` style then it will fall back to the default style if `Intl` is not available.

`Intl` is present in all modern web browsers and is absent from some of the old ones: [Internet Explorer 10, Safari 9 and iOS Safari 9.x](http://caniuse.com/#search=intl) (which can be solved using [`Intl` polyfill](https://github.com/andyearnshaw/Intl.js)).

Node.js starting from `0.12` has `Intl` built-in, but only includes English locale data by default. If your app needs to support more locales than English on server side (e.g. Server-Side Rendering) then you'll need to use [`Intl` polyfill](https://github.com/andyearnshaw/Intl.js).

An example of applying [`Intl` polyfill](https://github.com/andyearnshaw/Intl.js):

```
npm install intl@1.2.4 --save
```

Node.js

```js
import IntlPolyfill from 'intl'

const locales = ['en', 'ru', ...]

if (typeof Intl === 'object') {
  if (!Intl.DateTimeFormat || Intl.DateTimeFormat.supportedLocalesOf(locales).length !== locales.length) {
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  global.Intl = IntlPolyfill
}
```

Web browser: only download `intl` package if the web browser doesn't support it, and only download the required locale.

```js
async function initIntl() {
  if (typeof Intl === 'object') {
    return
  }
  await Promise.all([
    import('intl'),
    import('intl/locale-data/jsonp/en'),
    import('intl/locale-data/jsonp/ru'),
    ...
  ])
}

initIntl().then(...)
```

<!--
## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This module is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation. Widely consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

After developing, the full test suite can be evaluated by running:

```sh
npm test
```

When you're ready to test your new functionality on a real project, you can run

```sh
npm pack
```

It will `build`, `test` and then create a `.tgz` archive which you can then install in your project folder

```sh
npm install [module name with version].tar.gz
```
-->

## License

[MIT](LICENSE)