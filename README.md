# javascript-time-ago

[![npm version](https://img.shields.io/npm/v/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![npm downloads](https://img.shields.io/npm/dm/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![coverage](https://img.shields.io/coveralls/catamphetamine/javascript-time-ago/master.svg?style=flat-square)](https://coveralls.io/r/catamphetamine/javascript-time-ago?branch=master)

International higly customizable relative date/time formatter (both for past and future dates).

Formats a date to something like:

  * just now
  * 5m
  * 15 min
  * 25 minutes
  * half an hour ago
  * an hour ago
  * 2h
  * yesterday
  * 2d
  * 1wk
  * 2 weeks ago
  * 3 weeks
  * half a month ago
  * 1 mo. ago
  * 2 months
  * half a year
  * a year
  * 2yr
  * 5 years ago
  * … or whatever else

## Usage

```
npm install javascript-time-ago --save
```

First, the library must be initialized with a set of desired locales.

```js
// Time ago formatter.
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

// Add locale-specific relative date/time formatting rules.
TimeAgo.locale(en)
TimeAgo.locale(ru)
```

After the initialization step is complete it is ready to format relative dates.

```js
import TimeAgo from 'javascript-time-ago'

const timeAgo = new TimeAgo('en-US')

timeAgo.format(new Date())
// "just now"

timeAgo.format(new Date(Date.now() - 60 * 1000))
// "a minute ago"

timeAgo.format(new Date(Date.now() - 2 * 60 * 60 * 1000))
// "2 hours ago"

timeAgo.format(new Date(Date.now() - 24 * 60 * 60 * 1000))
// "a day ago"
```

```js
import TimeAgo from 'javascript-time-ago'

// cyka blyat idi nahui
const timeAgo = new TimeAgo('ru-RU')

timeAgo.format(new Date())
// "только что"

timeAgo.format(new Date(Date.now() - 60 * 1000)))
// "минуту назад"

timeAgo.format(new Date(Date.now() - 2 * 60 * 60 * 1000)))
// "2 часа назад"

timeAgo.format(new Date(Date.now() - 24 * 60 * 60 * 1000))
// "днём ранее"
```

## Twitter style

Mimics Twitter style of time ago ("1m", "2h", "Mar 3", "Apr 4, 2012")

```js
…
const timeAgo = new TimeAgo('en-US')

timeAgo.format(new Date(), 'twitter')
// ""

timeAgo.format(new Date(Date.now() - 60 * 1000), 'twitter')
// "1m"

timeAgo.format(new Date(Date.now() - 2 * 60 * 60 * 1000), 'twitter')
// "2h"
```

The built-in Twitter style uses `Intl` internally for formatting `day/month/year` labels. This is not an issue for modern web browsers but requies `Intl` polyfill for a couple of older browsers and for Node.js (if you're running this code on server side). See the [`Intl`](https://github.com/catamphetamine/javascript-time-ago#intl) section of this document for `Intl` polyfill instructions. When `Intl` is not available Twitter style falls back to the default one.

## Fuzzy style

```js
timeAgo.format(new Date(), 'fuzzy')
```

Similar to the default style but with "ago" omitted:

  * just now
  * 1 minute
  * 2 minutes
  * 5 minutes
  * 10 minutes
  * 15 minutes
  * 20 minutes
  * half an hour
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
  * half a year
  * 1 year
  * 2 years
  * 3 years
  * …

## Loading locales

No locale data is loaded by default: a developer must manually choose which locales must be loaded. This is to reduce the resulting javascript bundle size.

If the resulting bundle size is of no concern (e.g. a big enterprise application), or if the code is being run on server side, then use this helper to load all available locales:

```js
require('javascript-time-ago/load-all-locales')
```

# Advanced

The above sections explained all the basics required for using this library in a project.

This part of the documentation contains some advanced topics for those willing to have a better understanding of how this library works internally.

## Customization

Localization can be further customized by selecting one of the "flavours": `long`, `short`, or mabe some others (like `tiny` defined for `en`). Refer to [`locale/en`](https://github.com/catamphetamine/javascript-time-ago/blob/master/locale/en) for an example.

```js
import english from 'javascript-time-ago/locale/en'

english.tiny  // '1s', '2m', '3h', '4d', …
english.short // '1 sec. ago', '2 min. ago', …
english.long  // '1 second ago', '2 minutes ago', …
```

One can pass `style` (`string` or `object`) as a second parameter to the `.format(date, style)` function. The `style` object can specify (all are optional):

  * `flavour` – preferred labels variant (e.g. `short`, `long`)
  * `units` – a list of time interval measurement units which can be used in the formatted output (e.g. `['second', 'minute', 'hour']`)
  * `gradation` – custom time interval measurement units scale
  * `override` – is a function of `{ elapsed, time, date, now }`. If the `override` function returns a value, then the `.format()` call will return that value. Otherwise the date/time is formatter as usual.

(see [`twitter`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/style.js) style for an example)

## Gradation

A `gradation` is a list of time interval measurement steps. A simple example:

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

  * `factor` is a divider for the supplied time interval (in seconds)
  * `threshold` is a minimum time interval value (in seconds) required for this gradation step
  * (some advanced `threshold` customization is possible, see `./source/gradation.js` for more info)
  * `granularity` can also be specified (for example, `5` for `minute` to allow only 5-minute intervals)

For more gradation examples see [`source/gradation.js`](https://github.com/catamphetamine/javascript-time-ago/blob/master/source/gradation.js)

Built-in gradations:

```js
import { gradation } from 'javascript-time-ago'

gradation.canonical()  // '1 second ago', '2 minutes ago', …
gradation.convenient() // 'just now', '5 minutes ago', …
```

## Localization internals

The localization resides in the [`locale`](https://github.com/catamphetamine/javascript-time-ago/tree/master/locale) folder.

The format a localization is:

```js
{
  …
  "day": 
  {
    "past":
    {
      "one": "{0} day ago",
      "other": "{0} days ago"
    },
    "future":
    {
      "one": "in {0} day",
      "other": "in {0} days"
    }
  },
  …
}
```

The `past` and `future` can be defined by any of: `zero`, `one`, `two`, `few`, `many` and `other`. For more info on which is which read the [official Unicode CLDR documentation](http://cldr.unicode.org/index/cldr-spec/plural-rules). [Unicode CLDR](http://cldr.unicode.org/) (Common Locale Data Repository) is an industry standard and is basically a collection of formatting rules for all locales (date, time, currency, measurement units, numbers, etc).

To determine whether a certain amount of time (number) is `one`, `few`, or something else, `javascript-time-ago` uses Unicode CLDR rules for formatting plurals. These rules are number pluralization classifier functions (one for each locale) which can tell if a number should be treated as `zero`, `one`, `two`, `few`, `many` or `other`. Knowing how these pluralization rules work is not required but anyway here are some links for curious advanced readers: [rules explanation](http://cldr.unicode.org/index/cldr-spec/plural-rules), [list of rules for all locales](http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html), [converting those rules to javascript functions](https://github.com/eemeli/make-plural.js). These pluralization functions can be found as `plural` properties of a locale data.

## Future

When given future dates `.format()` produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

## Default

The default locale is `en` and can be changed: `TimeAgo.defaultLocale = 'ru'`.

## React

There is also a [React component](https://catamphetamine.github.io/react-time-ago/) built upon this library which autorefreshes itself.

## Intl

[`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object is not required for this library, but it may be required if you choose to use the built-in `twitter` style (though it will fall back to the default style if `Intl` is not available).

`Intl` is present in all modern web browsers and is absent from some of the old ones: [Internet Explorer 10, Safari 9 and iOS Safari 9.x](http://caniuse.com/#search=intl) (which can be solved using `Intl` polyfill).

Node.js starting from `0.12` has `Intl` built-in, but only includes English locale data by default. If your app needs to support more locales than English on server side then you'll need to use `Intl` polyfill.

Applying `Intl` polyfill:

```
npm install intl@1.2.4 --save
npm install intl-locales-supported --save
```

Node.js

```js
import IntlPolyfill from 'intl'
import intlLocalesSupported from 'intl-locales-supported'

if (typeof Intl === 'object') {
  if (!intlLocalesSupported(['ru', 'fr', ...])) {
    Intl.NumberFormat   = IntlPolyfill.NumberFormat
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
}
else {
  global.Intl = IntlPolyfill
}
```

Web browser: same as for Node.js with `global` replaced with `window`.

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