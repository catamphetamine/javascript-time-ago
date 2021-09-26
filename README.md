# javascript-time-ago

[![npm version](https://img.shields.io/npm/v/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![npm downloads](https://img.shields.io/npm/dm/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![coverage](https://img.shields.io/coveralls/catamphetamine/javascript-time-ago/master.svg?style=flat-square)](https://coveralls.io/r/catamphetamine/javascript-time-ago?branch=master)

Localized relative date/time formatting (both for past and future dates).

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

For React users, there's a [React version](https://www.npmjs.com/package/react-time-ago) — [See Demo](https://catamphetamine.gitlab.io/react-time-ago/)

This is a readme for version `2.x`. For older versions, [see version `1.x` readme](https://github.com/catamphetamine/javascript-time-ago/tree/1.x). For migrating from version `1.x` to version `2.x`, see a [migration guide](https://github.com/catamphetamine/javascript-time-ago/blob/master/MIGRATION.md).

## Install

```
npm install javascript-time-ago --save
```

If you're not using a bundler then use a [standalone version from a CDN](#cdn).

## Use

```js
import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

timeAgo.format(new Date())
// "just now"

timeAgo.format(Date.now() - 60 * 1000)
// "1 minute ago"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000)
// "2 hours ago"

timeAgo.format(Date.now() - 24 * 60 * 60 * 1000)
// "1 day ago"
```

## Locales

This library includes date/time formatting rules and labels for any language.

No languages are loaded default: a developer must manually choose which languages should be loaded. Languages should be imported from [`javascript-time-ago/locale`](https://unpkg.com/browse/javascript-time-ago/locale/) and then added via `TimeAgo.addLocale()` or `TimeAgo.addDefaultLocale()`.

The `locale` argument of `new TimeAgo(locale)` constructor is matched against the list of added languages, and the first matching one is used. For example, locales `"en-US"` and `"en-GB"` both match `"en"` language. If none of the added languages match the `locale`, the "default language" is used. If the "default language" hasn't been added, an error is thrown.

The "default language" is `"en"` by default, and can be set either by calling `addDefaultLocale()`:

```js
import ru from 'javascript-time-ago/locale/ru.json'
import de from 'javascript-time-ago/locale/de.json'
import es from 'javascript-time-ago/locale/es.json'

TimeAgo.addLocale(ru)
TimeAgo.addLocale(de)
TimeAgo.addDefaultLocale(es)
```

or by calling `setDefaultLocale()`:

```js
import ru from 'javascript-time-ago/locale/ru.json'
import de from 'javascript-time-ago/locale/de.json'
import es from 'javascript-time-ago/locale/es.json'

TimeAgo.addLocale(ru)
TimeAgo.addLocale(de)
TimeAgo.addLocale(es)

TimeAgo.setDefaultLocale('es')
```

In some cases, a developer might prefer to specify a list of `locales` to choose from rather than a single `locale`:

```js
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(de)

// "de" language will be used, as it's the first one to match.
new TimeAgo(['ru-RU', 'de-DE', 'en-US'])
```

<!--
If the resulting bundle size is of no concern (for example, when building a big enterprise application), or if the code is being run on server side (Node.js), then one can use this helper to load all available locales:

```js
require('javascript-time-ago/load-all-locales')
```
-->

An example of using Russian language:

```js
import TimeAgo from 'javascript-time-ago'

// Russian.
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(ru)

const timeAgo = new TimeAgo('ru-RU')

timeAgo.format(new Date())
// "только что"

timeAgo.format(Date.now() - 60 * 1000)
// "1 минуту назад"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000)
// "2 часа назад"

timeAgo.format(Date.now() - 24 * 60 * 60 * 1000)
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

timeAgo.format(Date.now() - 1 * 1000, 'round')
// 1 second ago → "1 second ago"

timeAgo.format(Date.now() - 29 * 1000, 'round')
// 29 seconds ago → "29 seconds ago"

timeAgo.format(Date.now() - 30 * 1000, 'round')
// 30 seconds ago → "1 minute ago"

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

Same as `"round"` style but without seconds. This is the default style.

```js
timeAgo.format(Date.now(), 'round-minute')
// 0 seconds ago → "just now"

timeAgo.format(Date.now() - 29 * 1000, 'round-minute')
// 29 seconds ago → "just now"

timeAgo.format(Date.now() - 30 * 1000, 'round-minute')
// 30 seconds ago → "1 minute ago"

// The rest is same as "round" style.
```

  * just now
  * 1 minute ago
  * 2 minutes ago
  * …

### Mini

Same as `"round"` style but as short as possible and without `" ago"`. Also, [doesn't include](https://github.com/catamphetamine/javascript-time-ago/issues/40) "weeks".

```js
timeAgo.format(new Date(), 'mini')
// 0 seconds ago → "0s"

timeAgo.format(new Date() - 1 * 1000, 'mini')
// 1 second ago → "1s"

timeAgo.format(Date.now() - 2 * 60 * 1000, 'mini')
// 2 minutes ago → "2m"

timeAgo.format(Date.now() - 3 * 60 * 60 * 1000, 'mini')
// 3 hours ago → "3h"

timeAgo.format(Date.now() - 4 * 24 * 60 * 60 * 1000, 'mini')
// 4 days ago → "4d"

timeAgo.format(Date.now() - 23 * 24 * 60 * 60 * 1000, 'mini')
// 23 days ago → "23d"

timeAgo.format(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000, 'mini')
// 5 months ago → "5mo"

timeAgo.format(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000, 'mini')
// 1 year ago → "1yr"
```

For best compatibility, `mini.json` labels should be [defined](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) for a locale, otherwise you might [end up with](https://github.com/catamphetamine/javascript-time-ago/issues/49) labels like `"-1m"` for "one minute ago" for some languages. Send `mini.json` pull requests for the missing languages if you speak those.

### Mini (now)

Same as `"mini"` style but outputs `"now"` instead of `"0s"`.

```js
timeAgo.format(new Date(), 'mini-now')
// 0 seconds ago → "now"

timeAgo.format(new Date() - 1 * 1000, 'mini-now')
// 1 second ago → "1s"

// The rest is same as "mini" style.
```

### Mini (minute)

Same as `"mini"` style but without seconds (starts with minutes).

```js
timeAgo.format(new Date(), 'mini-minute')
// 0 seconds ago → "0m"

timeAgo.format(new Date() - 29 * 1000, 'mini-minute')
// 29 seconds ago → "0m"

timeAgo.format(new Date() - 30 * 1000, 'mini-minute')
// 30 seconds ago → "1m"

// The rest is same as "mini" style.
```

### Mini (minute-now)

Same as `"mini-minute"` style but outputs `"now"` instead of `"0m"`.

```js
timeAgo.format(new Date(), 'mini-minute-now')
// 0 seconds ago → "now"

timeAgo.format(new Date() - 29 * 1000, 'mini-minute-now')
// 29 seconds ago → "now"

timeAgo.format(new Date() - 30 * 1000, 'mini-minute-now')
// 30 seconds ago → "1m"

// The rest is same as "mini" style.
```

<!--
### Mini (first minute)

Same as `"twitter"` style but doesn't output anything before the first minute.

```js
timeAgo.format(new Date(), 'twitter-first-minute')
// 0 seconds ago → ""

timeAgo.format(new Date() - 59 * 1000, 'twitter-first-minute')
// 59 seconds ago → ""

timeAgo.format(new Date() - 60 * 1000, 'twitter-first-minute')
// 1 minute ago → "1m"

// The rest is same as "twitter" style.
```
-->

### Twitter

Mimics [Twitter](https://twitter.com) style of "time ago" labels (`"1s"`, `"2m"`, `"3h"`, `"Mar 4"`, `"Apr 5, 2012"`)

```js
timeAgo.format(new Date(), 'twitter')
// 0 seconds ago → "0s"

timeAgo.format(new Date() - 1 * 1000, 'twitter')
// 1 second ago → "1s"

timeAgo.format(Date.now() - 2 * 60 * 1000, 'twitter')
// 2 minutes ago → "2m"

timeAgo.format(Date.now() - 3 * 60 * 60 * 1000, 'twitter')
// 3 hours ago → "3h"

timeAgo.format(Date.now() - 4 * 24 * 60 * 60 * 1000, 'twitter')
// More than 24 hours ago → `month/day` ("Mar 4")

timeAgo.format(Date.now() - 364 * 24 * 60 * 60 * 1000, 'twitter')
// Another year → `month/day/year` ("Mar 5, 2017")
```

`"twitter"` style uses [`Intl`](https://gitlab.com/catamphetamine/relative-time-format#intl) for formatting `day/month/year` labels. If `Intl` is not available (for example, in Internet Explorer), it falls back to day/month/year labels: `"1d"`, `"1mo"`, `"1yr"`.

For best compatibility, `mini.json` labels should be defined for a [locale](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles). Send pull requests for the missing ones.

### Twitter (now)

Same as `"twitter"` style but outputs `"now"` instead of `"0s"`.

```js
timeAgo.format(new Date(), 'twitter-now')
// 0 seconds ago → "now"

timeAgo.format(new Date() - 1 * 1000, 'twitter-now')
// 1 second ago → "1s"

// The rest is same as "twitter" style.
```

### Twitter (minute)

Same as `"twitter"` style but without seconds (starts with minutes).

```js
timeAgo.format(new Date(), 'twitter-minute')
// 0 seconds ago → "0m"

timeAgo.format(new Date() - 29 * 1000, 'twitter-minute')
// 29 seconds ago → "0m"

timeAgo.format(new Date() - 30 * 1000, 'twitter-minute')
// 30 seconds ago → "1m"

// The rest is same as "twitter" style.
```

### Twitter (minute-now)

Same as `"twitter-minute"` style but outputs `"now"` instead of `"0m"`.

```js
timeAgo.format(new Date(), 'twitter-minute-now')
// 0 seconds ago → "now"

timeAgo.format(new Date() - 29 * 1000, 'twitter-minute-now')
// 29 seconds ago → "now"

timeAgo.format(new Date() - 30 * 1000, 'twitter-minute-now')
// 30 seconds ago → "1m"

// The rest is same as "twitter" style.
```

### Twitter (first minute)

Same as `"twitter"` style but doesn't output anything before the first minute.

```js
timeAgo.format(new Date(), 'twitter-first-minute')
// 0 seconds ago → ""

timeAgo.format(new Date() - 29 * 1000, 'twitter-first-minute')
// 29 seconds ago → ""

timeAgo.format(new Date() - 30 * 1000, 'twitter-first-minute')
// 30 seconds ago → "1m"

// The rest is same as "twitter" style.
```

## Custom

A custom "style" object may be passed as a second parameter to `.format(date, style)`, a `style` being an object defining `labels` and `steps`.

### Labels

`labels` should be the name of the time labels variant that will be used for generating output. When not defined, is set to [`"long"`](#labels) by default.

`labels` can also be an array of such time label variant names, in which case each one of them is tried until a supported one is found. For example, for `labels: ["mini", "short"]` it will search for `"mini"` labels first and then fall back to `"short"` labels if `"mini"` labels aren't defined for the language.

[`"long"`, `"short"` and `"narrow"`](https://unpkg.com/browse/relative-time-format/locale/en.json) time labels are always present for each language, because they're provided by [CLDR](http://cldr.unicode.org/). `long` is the normal one, `short` is an abbreviated version of `long`, `narrow` is supposed to be shorter than `short` but ends up just being weird: it's either equal to `short` or is, for example, `"-1 d."` for `"1 day ago"` in Russian.

Other time labels like `"now"` and `"mini"` are only defined for a [small subset](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) of languages. Send your pull requests for the missing ones.

New labels can be added by calling `TimeAgo.addLabels()` function.

```js
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { round } from 'javascript-time-ago/locale/steps'

TimeAgo.addDefaultLocale(en)

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

TimeAgo.addLabels('en', 'custom', customLabels)

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
    minTime: 60,
    // "minute" labels are used for formatting the output.
    formatAs: 'minute'
  },
  {
    // This step is effective starting from 59.5 minutes.
    minTime: 60 * 60,
    // "hour" labels are used for formatting the output.
    formatAs: 'hour'
  },
  …
]
```

A step can be described by:

  <!-- * `minTime: number` — A minimum time interval (in seconds) required for this step, meaning that `minTime` controls the progression from one step to another. The first step's `minTime` is `0` by default. -->

  <!-- In some cases, when using `unit`s that may or may not be defined for a language, a developer could support both cases: when the `unit` is available and when it's not. For that, they'd use a special `minTime: { [stepId]: minTime, ..., default: minTime }` property that overrides `min` when the previous eligible step's `id` is `[stepId]`. -->

  <!-- * `formatAs: string` — A time measurement unit, the labels for which are used to generate the output of this step. If the time unit isn't supported by the language, then the step is ignored. The time units supported in all languages are: `second`, `minute`, `hour`, `day`, `week`, `quarter`, `month`, `year`. For [some languages](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles), this library also defines `now` unit (`"just now"`). -->

  <!-- * `factor` — A divider for the time interval value which is in seconds. For example, if `unit` is `"seconds"` then `factor` should be `1`, and if `unit` is `"minutes"` then `factor` should be `60` because to get the amount of minutes one should divide the amout of seconds by `60`. This `factor` property is actually a redundant one and can be derived from `unit` so it will be removed in the next major version. -->

  <!--   * `granularity` — (advanced) Time interval value "granularity". For example, it could be set to `5` for minutes to allow only 5-minute increments when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc. Perhaps this feature will be removed because there seem to be no use cases of it in the real world. -->

##### `minTime`

A minimum time interval (in seconds) required for a step, meaning that `minTime` controls the progression from one step to another. Every step must define a `minTime` in one way or another. The first step's `minTime` is `0` by default.

If a step is defined by [`formatAs`](#formatas), and its previous step is also defined by `formatAs`, then such step's `minTime`, if not specified, is calculated automatically according to the selected ["rounding"](#rounding). For example, if the previous step is `{ formatAs: 'second' }` and the current step is `{ formatAs: 'minute' }` then the current step's `minTime` is automatically calculated as `59.5` when `round` is "round" (default), and `60` when `round` is "floor".

While `minTime` is usually a number, it could also be a `function` returning a number in order to support unusual cases like absolute date formatting in [`"twitter"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/twitter.js) style.

```js
minTime(
  date: number,        // The date argument, converted to a timestamp.
  {
    future: boolean,   // Is `true` if `date > now`, or if `date === now`
                       // and `future: true` option was passed to `.format()`.

    getMinTimeForUnit(unit: string, prevUnit: string?): number?
                       // Returns the `minTime` for a transition from a
                       // previous step with `formatAs: prevUnit` to a
                       // step with `formatAs: unit`.
                       // For example, if the previous step is `formatAs: "second"`,
                       // then `getMinTimeForUnit('minute')` returns `59.5`
                       // when `round` is "round", and `60` when `round` is "floor".
                       // A developer can also explicitly specify the previous step's unit:
                       // `getMinTimeForUnit('minute', 'second')`.
                       // Returns `undefined` if `unit` or `prevUnit` are not supported.
  }
): number
```

##### `formatAs`

A time measurement unit, the labels for which are used to generate the output of a step. If the time unit isn't supported by the language, then the step is ignored. The time units supported in all languages are: `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`. For [some languages](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles), this library also defines `now` unit (`"just now"`).

##### `format()`

Alternatively to `formatAs`, a step may specify a `format()` function:

```js
format(
  date: number,        // The date argument, converted to a timestamp.
  locale: string,      // The currently selected language. Example: "en".
  {
    formatAs(unit: string, value: number): string,
                       // A function that could be used to format `value` in `unit`s.
                       // Example: `formatAs('second', -2)`
                       // Outputs: "2 seconds ago"

    now: number,       // The current date timestamp.

    future: boolean    // Is `true` if `date > now`, or if `date === now`
                       // and `future: true` option was passed to `.format()`.
  }
): string?
```

<!--
##### Built-in `steps`

`/steps` export provides some built-in "steps" that can be used when creating custom styles.

```js
import { round } from 'javascript-time-ago/steps'
```

* [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/round.js) — The `steps` used in the [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/round.js) style.
-->

<!-- * [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/approximate.js) — (legacy) The `steps` used in the [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/approximate.js) style. -->

##### Time unit constants

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

### Rounding

Controls the rounding of an amount of time units.

The default `round` is `"round"` which equals to `Math.round()`.

* `0.1` sec. ago → `"0 sec. ago"`
* `0.4` sec. ago → `"0 sec. ago"`
* `0.5` sec. ago → `"1 sec. ago"`
* `0.9` sec. ago → `"1 sec. ago"`
* `1.0` sec. ago → `"1 sec. ago"`

Some people [asked](https://github.com/catamphetamine/javascript-time-ago/issues/38#issuecomment-707094043) for an alternative rounding method, so there's also `round: "floor"` which equals to `Math.floor()`.

* `0.1` sec. ago → `"0 sec. ago"`
* `0.4` sec. ago → `"0 sec. ago"`
* `0.5` sec. ago → `"0 sec. ago"`
* `0.9` sec. ago → `"0 sec. ago"`
* `1.0` sec. ago → `"1 sec. ago"`

A developer can choose the rounding method by passing `round` option to `timeAgo.format(date, [style], options)`. The default rounding can also be set for a [style](#styles) by setting its `round` property.

## Future

When given future dates, `.format()` produces the corresponding output.

```js
timeAgo.format(Date.now() + 5 * 60 * 1000)
// "in 5 minutes"
```

Zero time interval is a special case: by default, it's formatted in past time. To format zero time interval in future time, pass `future: true` option to `.format()`.

```js
// Without `future: true` option:

timeAgo.format(Date.now())
// "just now"

timeAgo.format(Date.now() + 5 * 60 * 1000)
// "in 5 minutes"

// With `future: true` option:

timeAgo.format(Date.now(), { future: true })
// "in a moment"

timeAgo.format(Date.now() + 5 * 60 * 1000, { future: true })
// "in 5 minutes" (no difference)
```

## Now

The `.format()` function accepts an optional `now: number` option: it can be used in tests to specify the exact "base" timestamp relative to which the time interval will be calculated.

```js
timeAgo.format(60 * 1000, { now: 0 })
// "1 minute ago"
```

## Update Interval

When speaking of good User Experience ("UX"), a formatted relative date, once rendered, should be constantly refreshed. And for that, the application should know how often should it refresh the formatted date. For that, each `step` should provide an update interval.

When a `step` has `formatAs` configured, then `getTimeToNextUpdate()` function is created automatically for it. Otherwise, a developer should supply their own `getTimeToNextUpdate()` function for a `step`.

```js
getTimeToNextUpdate(
  date: number, // The date argument, converted to a timestamp.
  {
    getTimeToNextUpdateForUnit(unit: string): number?,
                       // Returns "time to next update" for a time unit.
                       // This is what the library calls internally
                       // when `formatAs` is configured for a `step`.
                       // Example: `getTimeToNextUpdateForUnit('minute')`.
                       // Can return `undefined` in edge cases:
                       // for example, when `unit` is "now".

    now: number,       // The current date timestamp.

    future: boolean    // Is `true` if `date > now`, or if `date === now`
                       // and `future: true` option was passed to `.format()`.
  }
): number?
```

The application can then pass `getTimeToNextUpdate: true` option to `.format()` to get the best time to update the relative date label.

```js
const timeAgo = new TimeAgo('en-US')

let updateTimer

function render() {
  // Format the date.
  const [formattedDate, timeToNextUpdate] = timeAgo.format(date, {
    getTimeToNextUpdate: true
  })
  // Update the label.
  setFormattedDate(formattedDate)
  // Schedule next render.
  // `timeToNextUpdate` may be `undefined`, so provide a sensible default.
  updateTimer = setTimeout(render, getSafeTimeoutInterval(timeToNextUpdate || 60 * 1000))
}

// `setTimeout()` has a bug where it fires immediately
// when the interval is longer than about `24.85` days.
// https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
const SET_TIMEOUT_MAX_SAFE_INTERVAL = 2147483647
function getSafeTimeoutInterval(interval) {
  return Math.min(interval, SET_TIMEOUT_MAX_SAFE_INTERVAL)
}
```

Notice that `setTimeout()` has a bug where it [fires immediately](https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values) when the interval is longer than about `24.85` days, so the interval should not exceed that number. Otherwise, it will result in an infinite recursion.

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

This library uses an [`Intl.RelativeTimeFormat`](https://www.npmjs.com/package/relative-time-format) polyfill under the hood. The polyfill is only [`3.5 kB`](https://github.com/tc39/proposal-intl-relative-time#polyfills) in size so it won't affect the total bundle size.

Some people have
 [requested](https://github.com/catamphetamine/javascript-time-ago/issues/21) the ability to use native [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) and [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) instead of the polyfills: in this case, pass `polyfill: false` option when creating a `TimeAgo` instance.

```js
new TimeAgo('en-US', { polyfill: false })
```

## React

For React users, there's a [React version](https://www.npmjs.com/package/react-time-ago) — [See Demo](https://catamphetamine.gitlab.io/react-time-ago/).

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.com](https://jsdelivr.com)

```html
<!-- Example `[version]`: `2.x` -->
<script src="https://unpkg.com/javascript-time-ago@[version]/bundle/javascript-time-ago.js"></script>

<script>
  TimeAgo.addDefaultLocale({
    locale: 'en',
    now: {
      now: {
        current: "now",
        future: "in a moment",
        past: "just now"
      }
    },
    long: {
      year: {
        past: {
          one: "{0} year ago",
          other: "{0} years ago"
        },
        future: {
          one: "in {0} year",
          other: "in {0} years"
        }
      },
      ...
    }
  })
</script>

<script>
  alert(new TimeAgo('en-US').format(new Date()))
</script>
```

## Intl

(this is an "advanced" section)

[`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object is not required for this library, but, for example, if you choose to use the built-in `twitter` style then it will format longer intervals as `1d`, `1mo`, `1yr` instead of `Apr 10` or `Apr 10, 2019` if `Intl` is not available: that's because it uses `Intl.DateTimeFormat` for formatting absolute dates.

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

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

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