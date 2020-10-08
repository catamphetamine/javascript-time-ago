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

This is a readme for version `2.x`. For older versions, [see version `1.x` readme](https://github.com/catamphetamine/javascript-time-ago/tree/1.x). For migrating from version `1.x` to version `2.x`, see a [migration guide](https://github.com/catamphetamine/javascript-time-ago/blob/master/MIGRATION.md).

## Install

```
npm install javascript-time-ago --save
```

## Use

```js
import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

// Create formatter.
const timeAgo = new TimeAgo('en-US')

// Format dates using "round" style.

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

No languages are loaded default: a developer must manually choose which languages should be loaded. The languages should be imported from [`javascript-time-ago/locale`](https://unpkg.com/browse/javascript-time-ago/locale/) and then added via `TimeAgo.addLocale(...)`. An example of using Russian language:

<!--
If the resulting bundle size is of no concern (for example, when building a big enterprise application), or if the code is being run on server side (Node.js), then one can use this helper to load all available locales:

```js
require('javascript-time-ago/load-all-locales')
```
-->

```js
import TimeAgo from 'javascript-time-ago'

// Russian.
import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addLocale(ru)

const timeAgo = new TimeAgo('ru-RU')

// Format dates using "round" style.

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

This library allows for any custom logic for formatting time intervals:

* What scale should be used for measuring time intervals: should it be precise down to the second, or should it only measure it up to a minute, or should it start from being more precise when time intervals are small and then gradually decrease its precision as time intervals get longer.

* What labels should be used: should it use the standard built-in labels for the languages (`"... minutes ago"`, `"... min. ago"`, `"...m"`), or should it use custom ones, or should it skip using relative time labels in some cases and instead output something like `"Dec 11, 2015"`.

Such configuration comes under the name of "style".

While a completely [custom](#custom) "style" could be supplied, this library comes with several [built-in ](https://github.com/catamphetamine/javascript-time-ago/tree/master/source/style) "styles" that some people might find useful.

Following is the list of built-in "styles".

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
// 45 seconds ago → "just now"

timeAgo.format(Date.now() - 15 * 1000, 'round-minute')
// 46 seconds ago → "1 minute ago"

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

`"approximate"` style is a legacy one that has been introduced in the early versions of this library. It's basically the same as `"round-minute"` with the difference that it rounds time in some cases:

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

`"approximate-time"` style is a legacy one that has been introduced in the early versions of this library. It's the same as the `"approximate"` style but without the "ago" part.

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

Not all locales support this style: only [those](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) having `long-time.json`.

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

`"twitter"` style uses [`Intl`](https://gitlab.com/catamphetamine/relative-time-format#intl) for formatting `day/month/year` labels. If `Intl` is not available (for example, in Internet Explorer), it falls back to day/month/year labels: `"1d"`, `"1mo"`, `"1yr"`.

For best compatibility, `mini-time.json` labels should be defined for a [locale](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles). Send pull requests for the missing ones.

### Twitter (first minute)

Same as `"twitter"` style but doesn't output anything before the first minute.

```js
timeAgo.format(new Date(), 'twitter-first-minute')
// 0 seconds ago → ""

timeAgo.format(new Date() - 1, 'twitter-first-minute')
// 45 seconds ago → ""

timeAgo.format(new Date() - 1, 'twitter-first-minute')
// 46 seconds ago → "1m"

// The rest is same as "twitter" style.
```

`"twitter-first-minute"` style uses [`Intl`](https://gitlab.com/catamphetamine/relative-time-format#intl) for formatting `day/month/year` labels. If `Intl` is not available (for example, in Internet Explorer), it falls back to day/month/year labels: `"1d"`, `"1mo"`, `"1yr"`.

For best compatibility, `mini-time.json` labels should be defined for a [locale](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles). Send pull requests for the missing ones.

## Custom

A custom "style" object may be passed as a second parameter to `.format(date, style)`, a `style` being an object defining `labels` and `steps`.

### Labels

`labels` should be the name of the time labels variant that will be used for generating output. When not defined, is set to [`"long"`](#labels) by default.

`labels` can also be an array of such time label variant names, in which case each one of them is tried until a supported one is found. For example, for `labels: ["mini-time", "short"]` it will search for `"mini-time"` labels first and then fall back to `"short"` labels if `"mini-time"` labels aren't defined for the language.

[`"long"`, `"short"` and `"narrow"`](https://unpkg.com/browse/relative-time-format/locale/en.json) time labels are always present for each language, because they're provided by [CLDR](http://cldr.unicode.org/). `long` is the normal one, `short` is an abbreviated version of `long`, `narrow` is supposed to be shorter than `short` but ends up just being weird: it's either equal to `short` or is, for example, `"-1 d."` for `"1 day ago"` in Russian.

Other time labels like `"now"` and `"mini-time"` are only defined for a [small subset](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) of languages. Send your pull requests for the missing ones.

New labels can be added by calling `TimeAgo.addLabels()` function.

```js
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { round } from 'javascript-time-ago/locale/steps'

TimeAgo.addLocale(en)

const customLabels = {
  second: {
    past: {
      one: "{0} second earlier",
      other: "{0} seconds earlier"
    },
    future: {
      one: "{0} second later",
      other: "{0} seconds later"
    }
  },
  ...
}

TimeAgo.addLabels(customLabels, 'custom', 'en')

const timeAgo = new TimeAgo('en-US')

const customStyle = {
  steps: round,
  labels: 'custom'
}

timeAgo.format(Date.now() - 10 * 1000, customStyle)
// "10 seconds earlier"
```

### Steps

Time interval measurement "steps".

Each "step" is tried until the last matching one is found, and that "step" is then used to generate the output. If no matching `step` was found, then an empty string is returned.

An example of `"round"` style `steps`:

```js
[
  {
    // "second" labels are used for formatting the output.
    formatAs: 'second'
  },
  {
    // This step is effective starting from 59.5 seconds.
    minTime: 59.5,
    // "minute" labels are used for formatting the output.
    formatAs: 'minute'
  },
  {
    // This step is effective starting from 59.5 minutes.
    minTime: 59.5 * 60,
    // "hour" labels are used for formatting the output.
    formatAs: 'hour'
  },
  …
]
```

A basic step is described by:

  * `minTime: number` — A minimum time interval (in seconds) required for this step, meaning that `minTime` controls the progression from one step to another. The first step's `minTime` is `0` by default.

  <!-- In some cases, when using `unit`s that may or may not be defined for a language, a developer could support both cases: when the `unit` is available and when it's not. For that, they'd use a special `minTime: { [stepId]: minTime, ..., default: minTime }` property that overrides `min` when the previous eligible step's `id` is `[stepId]`. -->

  * `formatAs: string` — A time measurement unit, the labels for which are used to generate the output of this step. If the time unit isn't supported by the language, then the step is ignored. The time units supported in all languages are: `second`, `minute`, `hour`, `day`, `week`, `quarter`, `month`, `year`. For [some languages](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles), this library also defines `now` unit (`"just now"`).

  <!-- * `factor` — A divider for the time interval value which is in seconds. For example, if `unit` is `"seconds"` then `factor` should be `1`, and if `unit` is `"minutes"` then `factor` should be `60` because to get the amount of minutes one should divide the amout of seconds by `60`. This `factor` property is actually a redundant one and can be derived from `unit` so it will be removed in the next major version. -->

  <!--   * `granularity` — (advanced) Time interval value "granularity". For example, it could be set to `5` for minutes to allow only 5-minute increments when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc. Perhaps this feature will be removed because there seem to be no use cases of it in the real world. -->

Alternatively to `minTime`, a step may specify a `test()` function:

```js
test(
  date: Date, // The date that was passed to `.format()`, converted to `Date`.
  {
    now: Date, // The current `Date`.
    future: boolean // Is `true` if `date > now`, or if `date === now`
                    // and `future: true` option was passed to `.format()`.
  }
): boolean
```

Alternatively to `formatAs`, a step may specify a `format()` function:

```js
format(
  date: (Date|number), // The date argument as it has been passed to `.format()`:
                       // either a `Date` or a `number`.
                       // It's not converted to a `Date` for legacy compatibility
                       // with the old versions of this library.
                       // It will be converted to `Date` in the next major version.
                       // For now, use something like this:
                       // `date = typeof date === 'number' ? new Date(date) : date`

  locale: string, // The currently selected language. Example: "en".

  {
    formatAs(unit: string, value: number): string, // A function that could be used
                                                   // to format `value` in `unit`s.
                                                   // Example: `formatAs('second', -2)`
                                                   // Outputs: "2 seconds ago"

    future: boolean // Is `true` if `date > now`, or if `date === now`
                    // and `future: true` option was passed to `.format()`.
  }
): string?
```

#### Built-in `steps`

`/steps` export provides a couple of built-in "steps" that can be used when creating custom styles.

```js
import { round, approximate } from 'javascript-time-ago/steps'
```

* [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/round.js) — The `steps` used in the [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/round.js) style.

* [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/approximate.js) — (legacy) The `steps` used in the [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/approximate.js) style.

#### Time unit constants

<!-- The `/steps` export provides a few utility time unit constants.  --><!-- and functions. -->

`/steps` export provides some utility time unit constants that could be used to calculate `minTime` values when defining custom `steps`:

```js
import { minute, hour, day, week, month, year } from 'javascript-time-ago/steps'

// In seconds
minute === 60
hour === 60 * 60
day === 24 * 60 * 60
...

const customSteps = [{
  minTime: 5 * minute,
  ...
}]
```

<!--
The `/steps` export also provides a utility function:

##### `getStepForUnit(steps: object[], unit: string): object?`

Finds a step of `steps` corresponding to a `unit`.

```js
import { round, getStepForUnit } from 'javascript-time-ago/steps'

getStepForUnit(round, 'minute') === {
  min: 59.5,
  unit: 'minute'
}
```
-->

<!--
##### `getDate(dateOrTimestamp: (number|Date)): Date`

Converts a `timestamp: number` or a `date: Date` to a `Date`.

Can be used in a step's `format(interval)` function when formatting

```js
import { getDate } from 'javascript-time-ago/steps'

getDate(1500000000000) === getDate(new Date('2017-07-14'))
```
-->

<!--
### Units

A list of allowed time interval measurement units. Example: `["second", "minute", "hour", ...]`. By default, all available units are defined. This property can be used to filter out some of the non-conventional time units like `"quarter"` which is present in [CLDR](http://cldr.unicode.org/) data. -->

## Future

When given future dates, `.format()` produces the corresponding output.

```js
timeAgo.format(Date.now() + 5 * 60 * 1000, 'round')
// "in 5 minutes"
```

Zero time interval is a special case: by default, it's formatted in past time. To format zero time interval in future time, pass `future: true` option to `.format()`.

```js
// Without `future: true` option:

timeAgo.format(Date.now(), 'round')
// "just now"

timeAgo.format(Date.now() + 5 * 60 * 1000, 'round')
// "in 5 minutes"

// With `future: true` option:

timeAgo.format(Date.now(), 'round', { future: true })
// "in a moment"

timeAgo.format(Date.now() + 5 * 60 * 1000, 'round', { future: true })
// "in 5 minutes" (no difference)
```

## Default Locale

The "default locale" is the locale used when none of the locales passed to `new TimeAgo()` constructor are supported. By default, the "default locale" is `"en"`.

```js
TimeAgo.setDefaultLocale('ru')
```

<!--
## Caching

Constructing a new `TimeAgo` class instance is assumed to be a potentially lengthy operation (even though in reality it isn't). One can use the exported `Cache` class for caching.

```js
import Cache from 'javascript-time-ago/Cache'

const cache = new Cache()
const object = cache.get('key1', 'key2', ...) || cache.put('key1', 'key2', ..., createObject())
```
-->

## Localization internals

This library uses an [`Intl.RelativeTimeFormat`](https://www.npmjs.com/package/relative-time-format) polyfill under the hood.

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