# javascript-time-ago

[![npm version](https://img.shields.io/npm/v/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![npm downloads](https://img.shields.io/npm/dm/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![coverage](https://img.shields.io/coveralls/catamphetamine/javascript-time-ago/master.svg?style=flat-square)](https://coveralls.io/r/catamphetamine/javascript-time-ago?branch=master)

Formats a `Date` into a string like `"1 day ago"`. In any language.

  * just now
  * 45s
  * 5m
  * 15 minutes ago
  * 3 hours ago
  * 2 days ago
  * in 4 months
  * in 5 years
  * …

It also tells one how often to [refresh](#refreshing) the label as the time goes by.

There's also a [React version](https://www.npmjs.com/package/react-time-ago) (see [demo](https://catamphetamine.gitlab.io/react-time-ago/))

## Install

```
npm install javascript-time-ago --save
```

Alternatively, one could include it on a web page [directly](#cdn) via a `<script/>` tag.

## Use

<!-- Migration notes: This is a readme for version `2.x`. If you're using version `1.x`, [see the old readme](https://github.com/catamphetamine/javascript-time-ago/tree/1.x). Also see a [migration guide](https://github.com/catamphetamine/javascript-time-ago/blob/master/MIGRATION.md) from version `1.x` to `2.x`. -->

To begin, decide on the set of languages that your application will be translated into. For now, let's assume that it's gonna be just English.

Then, for each of those languages, `import` the language data:

```js
// Adds support for English language
import 'javascript-time-ago/locale/en'
```

Now you're ready to create a `new TimeAgo()` formatter for any of those languages, and use it to convert dates into strings.

```js
// Create English formatter
const timeAgo = new TimeAgo('en')

timeAgo.format(new Date())
// "just now"

timeAgo.format(Date.now() - 60 * 1000)
// "1 minute ago"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000)
// "2 hours ago"

timeAgo.format(Date.now() - 24 * 60 * 60 * 1000)
// "1 day ago"
```

To change the output style, see the list of available [formatting styles](#formatting-styles).

P.S. After rendering a label, don't forget to [refresh](#refreshing) it as the time goes by.

## Languages

This library supports a lot of languages. None of those languages are loaded by default. A developer must manually choose which languages should be loaded and then call `TimeAgo.addLocale()` for each one of them.

The `locale` argument of `new TimeAgo(locale)` constructor will be matched against the list of added languages, and the first matching one will be used. For example, `new TimeAgo("en")` and `new TimeAgo("en-US")` will both use `"en"` language.

If the language for the specified `locale` hasn't been added, it will retry with a "default" `locale`. For that, a "default" `locale` has to have been added by calling `TimeAgo.addDefaultLocale()`. Otherwise, when there's no "default" locale to fall back to, it will just throw an error.

 <!-- or `TimeAgo.setDefaultLocale("en")`. By default, the default `locale` is `"en"`, although it still has to be added manually. -->

So how is "default" locale useful? It frees a developer from worrying about whether the `locale` argument is supported or not. They can just create a `new TimeAgo()` formatter with whatever `locale` argument and not even worry about potentially crashing the application in case it throws an error for that `locale`.

In the following example, the application supports three languages — English, German and French — and English is set to be the "default" one that will be used for any other language like Spanish.

```js
import 'javascript-time-ago/locale/en'
import 'javascript-time-ago/locale/de'
import 'javascript-time-ago/locale/fr'

import TimeAgo from 'javascript-time-ago'

// Sets English language as the default one
TimeAgo.setDefaultLocale('en')
```

```js
// Because "es" locale hasn't been added, it falls back to "en" locale
const timeAgo = new TimeAgo('es')

timeAgo.format(new Date())
// "just now"
```

<!--
`TimeAgo.addDefaultLocale()` is just a shortcut for `TimeAgo.addLocale()` + `TimeAgo.setDefaultLocale()`, so the code above is the same as the code below.

```js
import 'javascript-time-ago/locale/en'
import 'javascript-time-ago/locale/de'
import 'javascript-time-ago/locale/fr'

TimeAgo.setDefaultLocale('en')
```
-->

`new TimeAgo()` constructor also supports passing a list of `locales` to choose from. In that case, it will choose the first one that works.

```js
// Add English and German languages
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(de)

// "de" language will be chosen because it's the first one that works.
const timeAgo = new TimeAgo(['ru-RU', 'de-DE', 'en-US'])

timeAgo.format(new Date())
// "gerade jetzt"
```

<!--
If the resulting bundle size is of no concern (for example, when building a big enterprise application), or if the code is being run on server side (Node.js), then one can use this helper to load all available locales:

```js
require('javascript-time-ago/load-all-locales')
```
-->

<!--
An example of formatting dates in Russian:

```js
import TimeAgo from 'javascript-time-ago'

// Adds support for Russian language
import 'javascript-time-ago/locale/ru'

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
-->

## Formatting Styles

A "formatting style" defines how a date should be formatted relative to the current time.

It could be precise up to a second with `"1 second ago"`, `"2 seconds ago"`, `"3 seconds ago"`, etc labels, or it could prefer to combine all those under a single `"less than a minute ago"` label.

It could use verbose labels like `"1 minute ago"` or it could prefer shorter variants like `"1 min. ago"` or even `"1m"`. Or it could prefer to output a full date like `"Dec 11, 2015"` for dates that're older than 1 year from now.

While one could certainly implement their own [custom](#custom-style) formatting "style" from scratch, most applications would be totally fine with one of the few already-available styles that're described below.

### Round

`"round"` style just rounds the time difference up to the closest unit of time — second, minute, hour, etc — and then returns a label for that unit of time.

```js
timeAgo.format(Date.now(), 'round')
// 0 seconds ago: "just now"

timeAgo.format(Date.now() - 1 * 1000, 'round')
// 1 second ago: "1 second ago"

timeAgo.format(Date.now() - 29 * 1000, 'round')
// 29 seconds ago: "29 seconds ago"

timeAgo.format(Date.now() - 30 * 1000, 'round')
// 30 seconds ago: "1 minute ago"

timeAgo.format(Date.now() - 1.5 * 60 * 1000, 'round')
// 1.5 minutes ago: "2 minutes ago"
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
  * 23 hours ago
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

`"round-minute"` style is same as `"round"` style but without seconds. This is the default style that is used when no custom style is specified.

```js
timeAgo.format(Date.now(), 'round-minute')
// 0 seconds ago: "just now"

timeAgo.format(Date.now() - 29 * 1000, 'round-minute')
// 29 seconds ago: "just now"

timeAgo.format(Date.now() - 30 * 1000, 'round-minute')
// 30 seconds ago: "1 minute ago"

// The rest is same as "round" style.
```

  * just now
  * 1 minute ago
  * 2 minutes ago
  * …

### Mini

`"mini"` style is same as `"round"` style but with labels that're as short as possible, without the `" ago"` part, and it [doesn't](https://github.com/catamphetamine/javascript-time-ago/issues/40) output "weeks".

```js
timeAgo.format(new Date(), 'mini')
// 0 seconds ago: "0s"

timeAgo.format(new Date() - 1 * 1000, 'mini')
// 1 second ago: "1s"

timeAgo.format(Date.now() - 2 * 60 * 1000, 'mini')
// 2 minutes ago: "2m"

timeAgo.format(Date.now() - 3 * 60 * 60 * 1000, 'mini')
// 3 hours ago: "3h"

timeAgo.format(Date.now() - 4 * 24 * 60 * 60 * 1000, 'mini')
// 4 days ago: "4d"

timeAgo.format(Date.now() - 23 * 24 * 60 * 60 * 1000, 'mini')
// 23 days ago: "23d"

timeAgo.format(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000, 'mini')
// 5 months ago: "5mo"

timeAgo.format(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000, 'mini')
// 1 year ago: "1yr"
```

For best compatibility, `mini.json` labels should be [defined](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) for a locale, otherwise you might [end up with](https://github.com/catamphetamine/javascript-time-ago/issues/49) labels like `"-1m"` for "one minute ago" for some languages. Send `mini.json` pull requests for the missing languages if you speak those.

### Mini (now)

`"mini-now"` style is same as `"mini"` style with the only difference that it outputs `"now"` instead of `"0s"`.

```js
timeAgo.format(new Date(), 'mini-now')
// 0 seconds ago: "now"

timeAgo.format(new Date() - 1 * 1000, 'mini-now')
// 1 second ago: "1s"

// The rest is same as "mini" style.
```

### Mini (minute)

`"mini-minute"` style is same as `"mini"` style but without seconds.

```js
timeAgo.format(new Date(), 'mini-minute')
// 0 seconds ago: "0m"

timeAgo.format(new Date() - 29 * 1000, 'mini-minute')
// 29 seconds ago: "0m"

timeAgo.format(new Date() - 30 * 1000, 'mini-minute')
// 30 seconds ago: "1m"

// The rest is same as "mini" style.
```

### Mini (minute-now)

`"mini-minute-now"` style is same as `"mini-minute"` style with the only difference that it outputs `"now"` instead of `"0m"`.

```js
timeAgo.format(new Date(), 'mini-minute-now')
// 0 seconds ago: "now"

timeAgo.format(new Date() - 29 * 1000, 'mini-minute-now')
// 29 seconds ago: "now"

timeAgo.format(new Date() - 30 * 1000, 'mini-minute-now')
// 30 seconds ago: "1m"

// The rest is same as "mini" style.
```

<!--
### Mini (first minute)

Same as `"twitter"` style but doesn't output anything before the first minute.

```js
timeAgo.format(new Date(), 'twitter-first-minute')
// 0 seconds ago: ""

timeAgo.format(new Date() - 59 * 1000, 'twitter-first-minute')
// 59 seconds ago: ""

timeAgo.format(new Date() - 60 * 1000, 'twitter-first-minute')
// 1 minute ago: "1m"

// The rest is same as "twitter" style.
```
-->

### Twitter

`"twitter"` style mimicks [Twitter](https://twitter.com) labels: `"1s"`, `"2m"`, `"3h"`, `"Mar 4"`, `"Apr 5, 2012"`.

```js
timeAgo.format(new Date(), 'twitter')
// 0 seconds ago: "0s"

timeAgo.format(new Date() - 1 * 1000, 'twitter')
// 1 second ago: "1s"

timeAgo.format(Date.now() - 2 * 60 * 1000, 'twitter')
// 2 minutes ago: "2m"

timeAgo.format(Date.now() - 3 * 60 * 60 * 1000, 'twitter')
// 3 hours ago: "3h"

timeAgo.format(Date.now() - 4 * 24 * 60 * 60 * 1000, 'twitter')
// More than 24 hours ago → `month/day` ("Mar 4")

timeAgo.format(Date.now() - 364 * 24 * 60 * 60 * 1000, 'twitter')
// Another year → `month/day/year` ("Mar 5, 2017")
```

`"twitter"` style uses [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) when formatting `day/month/year` labels. When `Intl` is not available — for example, in Internet Explorer — it falls back to the usual short labels: `"1d"`, `"1mo"`, `"1yr"`, etc.

For best compatibility, `mini.json` labels should be [defined](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) for a locale. Send `mini.json` pull requests for the missing languages if you speak those.

### Twitter (now)

`"twitter-now"` style is same as `"twitter"` style with the only difference that it outputs `"now"` instead of `"0s"`.

```js
timeAgo.format(new Date(), 'twitter-now')
// 0 seconds ago: "now"

timeAgo.format(new Date() - 1 * 1000, 'twitter-now')
// 1 second ago: "1s"

// The rest is same as "twitter" style.
```

### Twitter (minute)

`"twitter-minute"` style is same as `"twitter"` style but without seconds.

```js
timeAgo.format(new Date(), 'twitter-minute')
// 0 seconds ago: "0m"

timeAgo.format(new Date() - 29 * 1000, 'twitter-minute')
// 29 seconds ago: "0m"

timeAgo.format(new Date() - 30 * 1000, 'twitter-minute')
// 30 seconds ago: "1m"

// The rest is same as "twitter" style.
```

### Twitter (minute-now)

`"twitter-minute-now"` style is same as `"twitter-minute"` style with the only difference that it outputs `"now"` instead of `"0m"`.

```js
timeAgo.format(new Date(), 'twitter-minute-now')
// 0 seconds ago: "now"

timeAgo.format(new Date() - 29 * 1000, 'twitter-minute-now')
// 29 seconds ago: "now"

timeAgo.format(new Date() - 30 * 1000, 'twitter-minute-now')
// 30 seconds ago: "1m"

// The rest is same as "twitter" style.
```

### Twitter (first minute)

`"twitter-first-minute"` style is same as `"twitter"` style with the only difference that it doesn't output anything before the first minute.

```js
timeAgo.format(new Date(), 'twitter-first-minute')
// 0 seconds ago: ""

timeAgo.format(new Date() - 29 * 1000, 'twitter-first-minute')
// 29 seconds ago: ""

timeAgo.format(new Date() - 30 * 1000, 'twitter-first-minute')
// 30 seconds ago: "1m"

// The rest is same as "twitter" style.
```

## Custom Style

A custom "style" object may be passed as a second argument to `.format(date, style)` function. A `style` object should have two properties: `labels` and `steps`.

Refer to the definition of the [built-in styles](https://github.com/catamphetamine/javascript-time-ago/tree/master/source/style) for an example.

<details>
<summary>How does a formatting style work</summary>

######

The time range (in seconds) spans from `-∞` to `+∞`, with "now" at `0` point. This entire range gets split into intervals, each with its own label. Example:

* Interval from `0` to `-1 second` is assigned `"just now"` label.
* Interval from `-1 second` to `-1 minute` is assigned `"{0} second(s) ago"` label.
* Interval from `-1 minute` to `-1 hour` is assigned `"{0} minute(s) ago"` label.
* ...
* Interval from `0` to `+1 second` is assigned `"in a moment"` label.
* Interval from `+1 second` to `+1 minute` is assigned `"in {0} second(s)"` label.
* Interval from `+1 minute` to `+1 hour` is assigned `"in {0} minute(s)"` label.
* ...

Intervals follow each other without any gaps, so the entire time range is divided into such intervals.

Now the job of the `format(date)` function is simple: it calculates the time difference (in seconds) between `date` and "now", and then maps that number onto the time range to see what interval it falls into. Then it returns the label for that interval, replacing `{0}` with the time difference number converted to the unit of time used by the interval.

For example, for `const date = new Date(Date.now() - 2 * 60 * 1000)`, `format(date)` first calculates the difference between the `date` and `Date.now()`, which is `-2 * 60` seconds, and then maps those `-2 * 60` seconds onto the time range and finds that it falls into the `-1 min … -1 hour` interval. So it returns the label for that interval, which is `"{0} minute(s) ago"`, replacing `{0}` with `2` because the unit of time used by the interval is `"minute"` which is equal to `60` seconds, so `-2 * 60 / 60 === -2`.

As one can see, with this approach, there could be an infinite amount of all kinds of formatting styles, and any possible formatting style could be expressed with this simple logic.
</details>

### Labels

`labels` property value should be the type of labels to output. There're several types of labels available:

* Labels that're provided by [Unicode CLDR](http://cldr.unicode.org/) for all languages:
  * `long` labels are the "normal" ones. Example: `"1 minute ago"`.
  * `short` labels are an abbreviated version of `long` ones. Example: `"1 min. ago"`.
  * `narrow` labels are supposed to be shorter than `short` ones but for some reason they look fine for some languages and weird for other ones. For example, a `short` label for `"1 day ago"` is `"1d ago"` in English, which looks fine, and `"-1 d."` in Russian, which looks weird. So I personally don't use `narrow` labels.
* Labels that're provided by the community via pull requests, available for a [subset](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles) of languages. If your language is missing from the list, you could create a pull request for it.
  * `mini` labels are the shortest. Example: `"1m"`.
  * `now` labels describe the time interval between `-1 second` and `+1 second`. There're 3 labels total: one for `-0.5 sec`, one for `0 sec`, and one for `0.5 sec`. Example: `"just now"`, `"now"`, `"in a moment"`.

The default value for the `labels` property is `"long"`.

`labels` can also be an array of label types, in which case the first supported label type will be used. For example, for `labels: ["mini", "short"]` it will search for `"mini"` labels first and then fall back to `"short"` labels if `"mini"` labels aren't defined for the language. This could be useful when defining a "style" with labels that might not be defined for all languages.

One could also supply custom labels. To do that, define `past` and `future` labels for each unit of time — `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year` — and then pass the object to `TimeAgo.addLabels()` function.

```js
import 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'

// Steps from the built-in "round" style can be reused in custom styles.
import { round } from 'javascript-time-ago/steps'

TimeAgo.addLocale(en)

// Define custom labels.
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

// Add the custom labels for English language under "custom" name.
TimeAgo.addLabels('en', 'custom', customLabels)

// Create English formatter.
const timeAgo = new TimeAgo('en-US')

// Define a custom style that reuses the `steps` from the built-in "round" style
// and uses the newly added "custom" labels.
const customStyle = {
  steps: round,
  labels: 'custom'
}

// Format a "10 seconds ago" date using the new custom style.
timeAgo.format(Date.now() - 10 * 1000, customStyle)
// Returns "10 seconds earlier"
```

### Steps

`steps` property should define a set of intervals that cover the time difference from `0` to `±∞`.

The `.format()` function starts at the first step and then moves to next one as long as the time difference passes the `minTime` threshold of the next step. The process is repeated until it stops at a certain step. That step is used to output the label.

If the `.format()` function doesn't pass the `minTime` threshold of the first step then it just outputs an empty string.

Here's an example of `steps` that're used in the built-in `"round"` style:

```js
[
  {
    // Starting from the time difference `0`,
    // use "second" labels.
    formatAs: 'second'
  },
  {
    // When the time difference becomes at least 1 minute (after rounding),
    // use "minute" labels.
    formatAs: 'minute'
  },
  {
    // When the time difference becomes at least 1 hour (after rounding),
    // use "hour" labels.
    formatAs: 'hour'
  },
  …
]
```

Each "step" could be described by the following properties:
* `formatAs?: string` — The labels for which unit of time to use in the output: `"second"`, `"minute"`, etc.
* `format?: (date) => string?` — If a developer doesn't like to use the standard `formatAs` labels, they could output any custom label for a given `date`.
* `minTime?: number` — The minimum time difference (in seconds) required for the step. When not specified, will be derived from `formatAs` property — for example, `formatAs: "minute"` → `minTime: 60` with `round: "floor"`.

  <!-- * `minTime: number` — A minimum time interval (in seconds) required for this step, meaning that `minTime` controls the progression from one step to another. The first step's `minTime` is `0` by default. -->

  <!-- In some cases, when using `unit`s that may or may not be defined for a language, a developer could support both cases: when the `unit` is available and when it's not. For that, they'd use a special `minTime: { [stepId]: minTime, ..., default: minTime }` property that overrides `min` when the previous eligible step's `id` is `[stepId]`. -->

  <!-- * `formatAs: string` — A unit of time, the labels for which are used to generate the output of this step. If the unit of time isn't supported by the language, then the step is ignored. The units of time that're supported in all languages are: `second`, `minute`, `hour`, `day`, `week`, `quarter`, `month`, `year`. For [some languages](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles), this library also defines `now` unit (`"just now"`). -->

  <!-- * `factor` — A divider for the time interval value which is in seconds. For example, if `unit` is `"seconds"` then `factor` should be `1`, and if `unit` is `"minutes"` then `factor` should be `60` because to get the amount of minutes one should divide the amout of seconds by `60`. This `factor` property is actually a redundant one and can be derived from `unit` so it will be removed in the next major version. -->

  <!--   * `granularity` — (advanced) Time interval value "granularity". For example, it could be set to `5` for minutes to allow only 5-minute increments when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc. Perhaps this feature will be removed because there seem to be no use cases of it in the real world. -->

<details>
<summary>More on <code>minTime</code></summary>

######

`minTime` threshold is the minimum time difference (in seconds) required for the step. Basically, `minTime` controls the progression from one step to another: it can't progress to the next step until the time difference (in seconds) reaches the `minTime` of that step.

Every step has to specify `minTime`, either explicitly or implicitly. An example of "implicitly" would be the first step's `minTime` which is `0` by default.

Another example of "implicitly" would be under-the-hood calcuation of `minTime` based on the unit of time of the step: when a step specifies [`formatAs`](#formatas) property, and the previous step also specifies `formatAs` property, then the step's `minTime`, when not explicitly specified, is calculated automatically from those `formatAs` properties according to the selected ["rounding"](#rounding). For example, if the previous step is `{ formatAs: "second" }` and the current step is `{ formatAs: "minute" }` then the current step's `minTime` is automatically calculated to be `59.5` when `round` is set to `"round"` (default), or `60` when `round` is set to `"floor"`.

So in almost all cases, the library automatically calculates `minTime` for you. However, if you're implementing some kind of an extravagant custom "style" then for steps that don't specify `formatAs` property you will be required to specify `minTime` explicitly.

In that case, even though `minTime` could be specified as a number, the recommended way is to specify it as a `function` returning a number because that would be the only way to account for the [rounding](#rounding) setting, which, by default, is `"round"`, but could also be `"floor"`.

* `minTime()` — Returns the `minTime` number.
  * Arguments:
    * `date: number` — The `date`, converted to a timestamp number. Not a time difference.
    * `parameters: object`
      * `future: boolean` — Is `true` either when `date > now` or when `date === now` and `future: true` parameter was passed to `.format()`.
      * `getMinTimeForUnit(unit: string, prevUnit?: string): number?` — returns the minimum time difference (in seconds) required for moving from a step with `formatAs: prevUnit` to a step with `formatAs: unit`.
        * Example:
          * When `round` is set to `"round"` (default), `getMinTimeForUnit("minute", "second")` returns `59.5`, meaning that the minimum time difference for moving from `"second"` labels to `"minute"` labels is `59.5` seconds, and for smaller time differences it should stay at `"second"` labels.
          * When `round` is set to `"foor"`, `getMinTimeForUnit("minute", "second")` returns `60`, meaning that the minimum time difference for moving from `"second"` labels to `"minute"` labels is `60` seconds, and for smaller time differences it should stay at `"second"` labels.
        * The second argument — `prevUnit` — is not required and will be automatically set to the previous step's `formatAs` property value.
        * If `unit` or `prevUnit` argument is invalid, `getMinTimeForUnit()` will not throw an error and will just return `undefined`.
</details>

<details>
<summary>More on <code>formatAs</code></summary>

######

`formatAs` is the unit of time, the labels for which will be used to generate the output of the step. If the specified unit of time isn't supported by the language (as explained further), then such step is ignored. The units of time that're supported in all languages are: `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`. For [some languages](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale-more-styles), this library defines an additional unit called `now` which can be used to output labels like `"just now"`. So if a step specifies `formatAs: "now"` and `now` unit isn't supported in a given language then such step is just skipped. If your language doesn't have a `now.json`, send a pull request (native speakers only).
</details>

<details>
<summary>More on <code>format()</code></summary>

######

A developer might prefer to output a custom label for a given step. In that case, instead of specifying `formatAs` property, they should specify a `format()` function.

* `format()` — Returns a custom label, or `undefined` for an empty output.
  * Arguments:
    * `date: number` — The `date`, converted to a timestamp number. Not a time difference.
    * `locale: string` — The selected language. Example: `"en"`.
    * `parameters: object`
      * `formatAs(unit: string, amount: number): string` — A function that can be used to get a label for an `amount` of given `unit`s of time.
        * Example: `formatAs('second', -2)` returns `"2 seconds ago"`.
      * `now: number` — The current date's timestamp. Use it instead of `Date.now()` to avoid the issue of `Date.now()` being slightly different for each different step.
      * `future: boolean` — Is `true` either when `date > now` or when `date === now` and `future: true` parameter was passed to `.format()`.
</details>

<!--
##### Built-in `steps`

`/steps` export provides some built-in "steps" that can be used when creating custom styles.

```js
import { round } from 'javascript-time-ago/steps'
```

* [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/round.js) — The `steps` used in the [`"round"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/round.js) style.
-->

<!-- * [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/steps/approximate.js) — (legacy) The `steps` used in the [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/approximate.js) style. -->

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

A list of allowed time interval measurement units. Example: `["second", "minute", "hour", ...]`. By default, all available units are defined. This property can be used to filter out some of the non-conventional units of time like `"quarter"` which is present in [CLDR](http://cldr.unicode.org/) data. -->

## Refreshing

After a time label has been rendered, it should periodically be updated (refreshed), because the label will change as the time flows. For that, the application needs to know how often it should refresh the label. It could refresh the label every second but that wouldn't be very efficient. For example, there's absolutely no need to refresh a `"1 year ago"` label every second. So how does one know how soon should the label be refreshed?

This library provides an easy way to know when is the best time to refresh the label:

```js
const [text, refreshDelay] = timeAgo.format(date, { getTimeToNextUpdate: true })
```

Example:

```js
let timerId

function renderLoop() {
  const [text, refreshDelay] = timeAgo.format(date, { getTimeToNextUpdate: true })

  // Update the label text.
  timeLabel.textContent = text

  if (refreshDelay !== undefined) {
    timerId = setTimeout(renderLoop, refreshDelay)
  }
}

// Render the label.
// It will automatically be refreshed when needed
timeLabel = createTimeLabelElement()
renderLoop()

// And when the label is no longer rendered, one should manually stop the periodic refresh.
clearTimeout(timerId)
```

The code above could be simplified by passing a `refresh` function instead of `getTimeToNextUpdate: true` parameter:

```js
const [text, stopRefreshing] = timeAgo.format(date, {
  // It will automatically call the `refresh()` function every time the label needs to be refreshed.
  refresh: (text) => {
    // Update the label text.
    timeLabel.textContent = text
  }
})

// Render the label.
// It will automatically be refreshed when needed.
timeLabel = createTimeLabelElement()
timeLabel.textContent = text

// And when the label is no longer rendered, one should manually stop the periodic refresh.
stopRefreshing()
```

If you're only using the built-in "styles", the returned `timeToNextUpdate` number is always defined. If you're using a custom "style", it is possible that it doesn't support `timeToNextUpdate` feature "out of the box" and in that case the returned `timeToNextUpdate` could be `undefined`. So as a general rule, when using a custom "style", always check that `timeToNextUpdate` is not `undefined`, and if it is, then assign some default refresh interval to it — like one minute (`60 * 1000`).

<!--
<details>
<summary>An example of how an application could use <code>timeToNextUpdate</code> to refresh the relative time label.</summary>

```js
const timeAgo = new TimeAgo('en-US')

const DEFAULT_REFRESH_INTERVAL = 60 * 1000

// `setTimeout()` timer reference.
let updateTimer

function renderLabel() {
  // Format the date and get the time to next update.
  const [text, timeToNextUpdate] = timeAgo.format(date, {
    getTimeToNextUpdate: true
  })
  // Update the label.
  labelElement.innerText = text
  // Schedule a re-render of the label.
  // The returend `timeToNextUpdate` could potentially be `undefined` when using a custom "style",
  // so a developer should provide some sensible default value.
  updateTimer = setTimeoutSafe(renderLabel, timeToNextUpdate || DEFAULT_REFRESH_INTERVAL)
}

// Start a recursive re-render of the label.
renderLabel()

// `setTimeout()` function has a bug when it fires immediately
// when the delay is longer than about `24.85` days.
// https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
//
// Since `renderLabel()` function uses `setTimeout()` for recursion,
// that would mean infinite recursion.
//
// `setTimeoutSafe()` function works around that bug
// by capping the delay at the maximum allowed value.
//
function setTimeoutSafe(func, delay) {
  return setTimeout(func, getSafeTimeoutDelay(delay))
}
function getSafeTimeoutDelay(delay) {
  return Math.min(delay, 2147483647)
}
```
</details>
-->

<!-- The `getTimeToNextUpdate: true` feature works out-of-the-box with any of the [built-in](#rounding) formatting "styles". For it to work well with a [custom](#custom-style) formatting "style", it has to satisfy certain conditions. -->

<details>
<summary>See the conditions that a custom formatting "style" has to meet in order to work well with <code>getTimeToNextUpdate: true</code> feature</summary>

* When each `step` in a given formatting "style" specifies a `minTime`, `timeToNextUpdate` can easily be calcuated by subtracting the current time difference from the `minTime` threshold of the next step.
* For steps that don't explicitly specify `minTime`, `minTime` can still be derived from `formatAs` property.
* For steps that don't specify niether `minTime` nor `formatAs` property, the calculation of `timeToNextUpdate` becomes slightly more complicated: such steps are required to specify a `getTimeToNextUpdate()` function property.
  * `getTimeToNextUpdate()`
    * Returns:
      * `timeToNextUpdate: number?` — The time until next update. If it returns `undefined` then it's interpreted as "the current label is constant and will not change" — for example, `"Jan 1, 2000"`.
    * Arguments:
      * `date: number` — The `date`, converted to a timestamp number. Not a time difference.
      * `parameters: object`
        * `getTimeToNextUpdateForUnit(unit: string): number` — A function that returns the "time until next update" (in milliseconds) for a given `unit` of time. For example, when using the default rounding method, and the argument is `"minute"`, and the current time difference is `60 * 1000` milliseconds, then the current label is gonna be `"1 minute ago"` and the "time until next update" for that label will be `30 * 1000` milliseconds because that's the time after which `"1 minute ago"` label changes into `"2 minutes ago"`.
          * The library itself uses this function when calculating the "time until next update" for steps that don't specify `minTime` but do specify `formatAs` property.
          * `getTimeToNextUpdateForUnit("now")` always returns `undefined`.
          * The return value of the function depends on the exact time that it was called at, i.e. when called at different times, it will produce different results. Example:
            * Consider that the current time difference is `-20` seconds and the unit of time is `"minute"`.
            * Initially, it outputs `"0 minutes ago"` because it rounds `20/60` to `0`.
            * What will `getTimeToNextUpdateForUnit("minute")` return?
              * When `round` value is `"round"` (default), it will return `10 * 1000` milliseconds, because `20 + 10` = `30`, and `30` seconds of time difference is the moment when it rounds `0.5 minute` to `1 minute` and changes the label from `"0 minutes ago"` to `"1 minute ago"`.
              * When `round` value is `"floor"`, it will return `40 * 1000` milliseconds, because `20 + 40` = `60`, and `60` seconds of time difference is the moment when it rounds `1.0 minute` to `1 minute` and changes the label from `"0 minutes ago"` to `"1 minute ago"`.
            * Now imagine that `20` seconds have passed. What will `getTimeToNextUpdateForUnit("minute")` return now?
              * When `round` value is `"round"` (default), it will return `50 * 1000` milliseconds, because `20 + 20 + 50` = `90`, and `90` seconds of time difference is the moment when it rounds `1.5 minute` to `2 minutes` and changes the label from `"1 minute ago"` to `"2 minutes ago"`.
              * When `round` value is `"floor"`, it will return `20 * 1000` milliseconds, because `20 + 20 + 20` = `60`, and `60` seconds of time difference is the moment when it rounds `1.0 minute` to `1 minute` and changes the label from `"0 minutes ago"` to `"1 minute ago"`.
            * As the time goes by, `getTimeToNextUpdateForUnit("minute")` will keep returning a different result every other time it is called.
        * `now: number` — The current date's timestamp. Use it instead of `Date.now()` to avoid the issue of `Date.now()` being slightly different for each different step.
        * `future: boolean` — Is `true` either when `date > now` or when `date === now` and `future: true` parameter was passed to `.format()`.
        <!-- * `round: string` — The rounding method that is used to convert a fractional time difference number to an integer. Either `"round"` or `"floor"`. Example: `"0.75 minutes ago"` → `"1 minute ago"` in case of `round: "round"`. -->
        <!-- * `getRoundFunction(round: string): (number) => number` — Returns the rounding function that corresponds to the `round: string` parameter above. For example, for `round: "floor"` it returns `Math.floor` function, and for `round: "round"` (or anything else) it returns `Math.round` function. A developer could use it to convert a fractional time difference number to an integer: `getRoundFunction(round)(number)`. -->
</details>

<!--
## Caching

Constructing a new `TimeAgo` class instance is assumed to be a potentially lengthy operation (even though in reality it isn't). One can use the exported `Cache` class for caching.

```js
import Cache from 'javascript-time-ago/Cache'

const cache = new Cache()
const object = cache.get('key1', 'key2', ...) || cache.put('key1', 'key2', ..., createObject())
```
-->

## Rounding

When printing a label such as `"1 minute ago"`, the time difference number has to be rounded for readability. For example, it won't print `"0.49 minutes ago"`. It has to round that number first.

The `round` setting controls how exactly fractional numbers should be rounded to integers.

The default `round` setting is `"round"` which follows `Math.round()` behavior.

* `0.1` sec. ago → `"0 sec. ago"`
* `0.4` sec. ago → `"0 sec. ago"`
* `0.5` sec. ago → `"1 sec. ago"`
* `0.9` sec. ago → `"1 sec. ago"`
* `1.0` sec. ago → `"1 sec. ago"`

Some people [asked](https://github.com/catamphetamine/javascript-time-ago/issues/38#issuecomment-707094043) for an alternative rounding method, so there's an alternative `round` setting value `"floor"` which follows `Math.floor()` behavior.

* `0.1` sec. ago → `"0 sec. ago"`
* `0.4` sec. ago → `"0 sec. ago"`
* `0.5` sec. ago → `"0 sec. ago"`
* `0.9` sec. ago → `"0 sec. ago"`
* `1.0` sec. ago → `"1 sec. ago"`

A developer can specify the preferred rounding by passing a `round` parameter to `timeAgo.format(date, [style,] options)`.

The default rounding method could also be specified "globally" for a given [style](#formatting-styles) by specifying a `round` property in the style object.

## Past vs Future

When given a past date, `.format()` returns an `"... ago"` label.

When given a future date, `.format()` returns an `"in ..."` label.

```js
timeAgo.format(Date.now() + 5 * 60 * 1000)
// "in 5 minutes"
```

When given a "now" date, which is neither past, nor future, `.format()` doesn't really know how it should represent the time difference — as `-0` or as `+0`.

By default, it treats it as `-0`, meaning that it will return `"0 seconds ago"` rather than `"in 0 seconds"`.

To instruct `.format()` to treat it as `+0`, pass `future: true` parameter.

```js
// Without `future: true`
timeAgo.format(Date.now())
// "just now"

// With `future: true`
timeAgo.format(Date.now(), { future: true })
// "in a moment"
```

## `now` parameter

The `.format()` function accepts an optional `now: number` parameter. It is used in tests to specify the exact "base" timestamp relative to which the time difference will be calculated.

```js
timeAgo.format(60 * 1000, { now: 0 })
// "1 minute ago"
```

## Full Date Formatter

Usually, when rendering a "relative" time label, one should also provide an "absolute" time label, perhaps somewhere in a tooltip, for the user to be able to know the precise date/time of the event.

This library exports a "helper" date formatter for just that:

```js
import FullDateFormatter from 'javascript-time-ago/full-date-formatter'

const formatter = new FullDateFormatter('en')
const tooltipText = formatter.format(date)
// Example output: "Saturday, January 1, 2000 at 3:00:00 AM"
```

`FullDateFormatter` uses [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) under the hood, which works in all modern browsers, and falls back to `Date.toString()` for ancient web browsers like Internet Explorer.

## React

For React users, there's a [React version](https://www.npmjs.com/package/react-time-ago) of this library. See [demo](https://catamphetamine.gitlab.io/react-time-ago/).

## `Intl.RelativeTimeFormat` Polyfill

This library uses an [`Intl.RelativeTimeFormat`](https://www.npmjs.com/package/relative-time-format) polyfill under the hood. That polyfill is only [`3.5 kB`](https://github.com/tc39/proposal-intl-relative-time#polyfills) in size so it won't affect the total bundle size.

Still, some people have
 [requested](https://github.com/catamphetamine/javascript-time-ago/issues/21) the ability to use native [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) and [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) instead of the polyfills. To do that, pass `polyfill: false` option when creating a `TimeAgo` instance.

```js
new TimeAgo('en-US', { polyfill: false })
```

<!--
## `Intl` Polyfill

(this is an "advanced details" section and you should probably skip it)

[`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object is not required by this library, but some "special" formatting styles may still use it. For example, `"twitter"` style uses `Intl.DateTimeFormat` to format long intervals as absolute dates — for example, `Jan 1` or `Jan 1, 2000` —  and if `Intl` is not available, it falls back to formatting those intervals as `1d`, `1mo`, `1yr`.

`Intl` is present in all modern web browsers and is only absent from some of the ancient ones: [Internet Explorer 10, Safari 9 and iOS Safari 9.x](http://caniuse.com/#search=intl). If your application must support those ancient browsers, consider using an [`Intl` polyfill](https://www.npmjs.com/package/intl).

Node.js, starting from version `0.12`, has `Intl` built-in, but it only includes English locale data by default. If your app needs to support more languages than just English on server side (for example, if it employs Server-Side Rendering) then you'll need to use an [`Intl` polyfill](https://www.npmjs.com/package/intl).

An example of using an [`Intl` polyfill](https://www.npmjs.com/package/intl):

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

Web browsers (only downloads `intl` package if the web browser doesn't support it, and only downloads the required locales).

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
-->

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

## CDN

To include this library directly via a `<script/>` tag on a page, one can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.com](https://jsdelivr.com)

```html
<!-- Example `[version]`: `2.x` -->
<script src="https://unpkg.com/javascript-time-ago@[version]/bundle/javascript-time-ago.js"></script>

<script>
  TimeAgo.addLocale({
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

## Tests

This component comes with a 100% code coverage.

To run tests:

```
npm test
```

To generate a code coverage report:

```
npm run test-coverage
```

The code coverage report can be viewed by opening `./coverage/lcov-report/index.html`.

Previously, when generating a code coverage report, it used to print a cryptic error message in the console and then produce an empty code coverage report:

```
Handlebars: Access has been denied to resolve the property "statements" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
```

That has been [worked](https://github.com/handlebars-lang/handlebars.js/issues/1646#issuecomment-578306544) [around](https://github.com/facebook/jest/issues/9396#issuecomment-573328488) by "anchoring" `handlebars` version in `devDependencies` at `handlebars@4.5.3`.

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments, even in my employer's private repos) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/javascript-time-ago) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/javascript-time-ago). Issues can be reported in any repo.

## License

[MIT](LICENSE)
