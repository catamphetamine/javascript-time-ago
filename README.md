# javascript-time-ago

[![npm version](https://img.shields.io/npm/v/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![npm downloads](https://img.shields.io/npm/dm/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![coverage](https://img.shields.io/coveralls/catamphetamine/javascript-time-ago/master.svg?style=flat-square)](https://coveralls.io/r/catamphetamine/javascript-time-ago?branch=master)

International higly customizable relative date/time formatter (both for past and future dates).

Formats a date/timestamp to:

  * just now
  * 5m
  * 15 min
  * 25 minutes
  * an hour ago
  * 1 mo.
  * 5 years ago
  * … or whatever else

For React users there's also a [React component](https://github.com/catamphetamine/react-time-ago).

This is a readme for version `2.x`. [See version `1.x` readme](https://github.com/catamphetamine/javascript-time-ago/tree/1.x). See a [migration guide](https://github.com/catamphetamine/javascript-time-ago/blob/master/MIGRATION.md) from version `1.x` to version `2.x`.

## Usage

```
npm install javascript-time-ago --save
```

```js
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)

// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US')

timeAgo.format(new Date())
// "just now"

timeAgo.format(Date.now() - 60 * 1000)
// "a minute ago"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000)
// "2 hours ago"

timeAgo.format(Date.now() - 24 * 60 * 60 * 1000)
// "a day ago"
```

Russian

```js
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

// cyka blyat
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

## Twitter style

Mimics Twitter style of time ago ("1m", "2h", "Mar 3", "Apr 4, 2012")

```js
timeAgo.format(new Date(), 'twitter')
// ""

timeAgo.format(Date.now() - 60 * 1000, 'twitter')
// "1m"

timeAgo.format(Date.now() - 2 * 60 * 60 * 1000, 'twitter')
// "2h"

timeAgo.format(Date.now() - 2 * 24 * 60 * 60 * 1000, 'twitter')
// "Mar 3"

timeAgo.format(Date.now() - 365 * 24 * 60 * 60 * 1000, 'twitter')
// "Mar 5, 2017"
```

Twitter style uses [`Intl`](https://github.com/catamphetamine/javascript-time-ago#intl) for formatting `day/month/year` labels. If `Intl` is not available then it falls back to the default style.

## "Just time" style

```js
timeAgo.format(Date.now() - 60 * 1000, 'time')
// "1 minute"
```

Similar to the default style but with "ago" omitted:

  * just now
  * 1 minute
  * 2 minutes
  * 5 minutes
  * 10 minutes
  * 15 minutes
  * 20 minutes
  * 1 hour
  * 2 hours
  * …
  * 20 hours
  * 1 day
  * 2 days
  * 3 days
  * 4 days
  * 5 days
  * 1 week
  * 2 weeks
  * 3 weeks
  * 1 month
  * 2 months
  * 3 months
  * 4 months
  * 1 year
  * 2 years
  * 3 years
  * …

## Loading locales

No locale data is loaded by default: a developer must manually choose which locales must be loaded. This is to reduce the resulting javascript bundle size.

If the resulting bundle size is of no concern (for example, when building a big enterprise application), or if the code is being run on server side (Node.js), then one can use this helper to load all available locales:

```js
require('javascript-time-ago/load-all-locales')
```

# Advanced

The above sections explained all the basics required for using this library in a project.

This part of the documentation contains some advanced topics for those willing to have a better understanding of how this library works internally.

## Customization

This library comes with three "styles" built-in: the default one, "twitter" style and "time" style. Each of these styles is an object defining its own `flavour` and `gradation`. If none of them suits a project then a custom "style" object may be passed as a second parameter to `.format(date, style)` having the following shape:

  * [`flavour`](https://github.com/catamphetamine/javascript-time-ago#flavour) – Preferred labels variant. Is `"long"` by default. Can be either a string (e.g. `"short"`) or an array of preferred flavours in which case each one of them is tried until a match is found. E.g. `["tiny", "short"]` searches for `tiny` first and falls back to `short`. `short`, `long` and `narrow` are always present for each locale.

  * [`gradation`](https://github.com/catamphetamine/javascript-time-ago#gradation) – Time interval measurement units scale. Is [`convenient`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/gradation/convenient.js) by default. Another one available is [`canonical`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/gradation/canonical.js). A developer may supply a custom `gradation` which must be an array of steps each of them having either a `unit : string` or a `format(value, locale) : string` function. See [Twitter style](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style/twitter.js) for such an advanced example.

  * `units` – A list of time interval measurement units which can be used in the output. E.g. `["second", "minute", "hour", ...]`. By default all available units are used. This is only used to filter out some of the non-conventional time units like `"quarter"` which is present in CLDR data.

## Flavour

Relative date/time labels come in various "flavours": `long`, `short`, `narrow` are the standard CLDR ones (always present) possibly accompanied by other ones like `tiny` which is defined for `en`, `ru` and `ko`. Refer to [`locale/en`](https://github.com/catamphetamine/javascript-time-ago/blob/master/locale/en) for an example.

```js
import english from 'javascript-time-ago/locale/en'

english.tiny  // '1s', '2m', '3h', '4d', …
english.narrow // '1 sec. ago', '2 min. ago', …
english.short // '1 sec. ago', '2 min. ago', …
english.long  // '1 second ago', '2 minutes ago', …
```

* `tiny` is supposed to be the shortest one possible. It's not a CLDR-defined one and has been defined for `en`, `ru` and `ko` so far.
* `narrow` is a CLDR-defined one and is supposed to be shorter than `short`, or at least no longer than it. I find `narrow` a weird one because for some locales it's the same as `short` and for other locales it's a really weird one (e.g. for Russian).
* `short` is "short".
* `long` is "regular".

## Gradation

A `gradation` is a list of time interval measurement steps.

```js
[
  {
    unit: 'second',
  },
  {
    unit: 'minute',
    factor: 60,
    threshold: 59.5
  },
  {
    unit: 'hour',
    factor: 60 * 60,
    threshold: 59.5 * 60
  },
  …
]
```

Each step is described by:

  * `unit` — a localized time measurement unit: `second`, `minute`, `hour`, `day`, `month`, `year` are the standardized CLDR ones.
  * `factor` — a divider for the supplied time interval (in seconds).
  * `threshold` — a minimum time interval value (in seconds) required for this gradation step. Each step must have a `threshold` defined except for the first one. Can a `number` or a `function(now: number, future: boolean)` returning a `number`. Some advanced `threshold` customization is possible like `threshold_for_[prev-unit]` (see `./source/gradation/convenient.js`).
  * `granularity` — for example, `5` for `minute` to allow only 5-minute intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc.

If a gradation step should output not simply a time interval of a certain time unit but something different instead then it may be described by:

 * `threshold` — same as above.
 * `format` — a `function(value, locale)` returning a `string`. `value` argument is the date/time being formatted as passed to `TimeAgo.format(value)`: either a `number` or a `Date`. `locale` argument is the selected locale (aka "BCP 47 language tag", e.g. `ru-RU`). For example, the built-in Twitter gradation has regular `minute` and `hour` steps followed by a custom one formatting a date as "day/month/year", e.g. `Jan 24, 2018`.

For more gradation examples see [`source/gradation`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/gradation) folder.

Built-in gradations:

```js
import {
  canonical, // '1 second ago', '2 minutes ago', …
  convenient // 'just now', '5 minutes ago', …
} from 'javascript-time-ago/gradation'
```

## Future

When given future dates `.format()` produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

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

This library is based on [`Intl.RelativeTimeFormat`](https://github.com/catamphetamine/relative-time-format).

## React

There is also a [React component](https://catamphetamine.github.io/react-time-ago/) built upon this library which autorefreshes itself.

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

## License

[MIT](LICENSE)