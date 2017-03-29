# javascript-time-ago

[![npm version](https://img.shields.io/npm/v/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![npm downloads](https://img.shields.io/npm/dm/javascript-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/javascript-time-ago)
[![coverage](https://img.shields.io/coveralls/halt-hammerzeit/javascript-time-ago/master.svg?style=flat-square)](https://coveralls.io/r/halt-hammerzeit/javascript-time-ago?branch=master)

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

## Installation

```
npm install intl-messageformat@^1.3.0 --save
npm install javascript-time-ago --save
```

This package assumes that the [`Intl`][Intl] global object exists in the runtime. `Intl` is present in all modern browsers [_except_ Internet Explorer 10 and Safari 9](http://caniuse.com/#search=intl) (which can be solved with the Intl polyfill).

Node.js starting from `0.12` has the `Intl` APIs built-in, but only includes the English locale data by default. If your app needs to support more locales than English, you'll need to [get Node to load the extra locale data](https://github.com/nodejs/node/wiki/Intl), or (a much simpler approach) just install the Intl polyfill.

If you decide you need the Intl polyfill then [here are some basic installation and configuration instructions](#intl-polyfill-installation)

## Usage

```js
import javascript_time_ago from 'javascript-time-ago'

// Load locale specific relative date/time messages
//
javascript_time_ago.locale(require('javascript-time-ago/locales/en'))
javascript_time_ago.locale(require('javascript-time-ago/locales/ru'))

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
//
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')

// Initialization complete.
// Ready to format relative dates and times.

const time_ago_english = new javascript_time_ago('en-US')

time_ago_english.format(new Date())
// "just now"

time_ago_english.format(new Date(Date.now() - 60 * 1000))
// "a minute ago"

time_ago_english.format(new Date(Date.now() - 2 * 60 * 60 * 1000))
// "2 hours ago"

time_ago_english.format(new Date(Date.now() - 24 * 60 * 60 * 1000))
// "a day ago"

const time_ago_russian = new javascript_time_ago('ru-RU')

time_ago_russian.format(new Date())
// "только что"

time_ago_russian.format(new Date(Date.now() - 60 * 1000)))
// "минуту назад"

time_ago_russian.format(new Date(Date.now() - 2 * 60 * 60 * 1000)))
// "2 часа назад"

time_ago_russian.format(new Date(Date.now() - 24 * 60 * 60 * 1000))
// "днём ранее"
```

## Twitter style

Mimics Twitter style time ago ("1m", "2h", "Mar 3", "Apr 4, 2012")

```js
…
const time_ago = new javascript_time_ago('en-US')

// A `style` is simply an `options` object 
// passed to the `.format()` function as a second parameter.
const twitter = time_ago.style.twitter()

time_ago.format(new Date(), twitter)
// ""

time_ago.format(new Date(Date.now() - 60 * 1000), twitter)
// "1m"

time_ago.format(new Date(Date.now() - 2 * 60 * 60 * 1000), twitter)
// "2h"
```

## Fuzzy style

```js
time_ago.style.fuzzy()
```

The time scale is (actually the same as the default style but with "ago" omitted):

  * just now
  * 1 minute
  * 2 minutes
  * 5 minutes
  * 10 minutes
  * 15 minutes
  * 20 minutes
  * half an hour
  * an hour
  * 2 hours
  * …
  * 20 hours
  * 1 day
  * 2 days
  * 3 days
  * 4 days
  * 5 days
  * a week
  * 2 weeks
  * 3 weeks
  * a month
  * 2 months
  * 3 months
  * 4 months
  * half a year
  * a year
  * 2 years
  * 3 years
  * …

## Intl polyfill installation

To install the Intl polyfill (supporting 200+ languages):

```bash
npm install intl --save
```

Then configure the Intl polyfill:

  * [Node.js](https://github.com/andyearnshaw/Intl.js#intljs-and-node)
  * [Webpack](https://github.com/andyearnshaw/Intl.js#intljs-and-browserifywebpack)
  * [Bower](https://github.com/andyearnshaw/Intl.js#intljs-and-bower)

## Localization

This library currently comes with English and Russian localization built-in, but any other locale can be added easily at runtime (Pull Requests adding new locales are accepted too).

The built-in localization resides in the [`locales`](https://github.com/halt-hammerzeit/javascript-time-ago/tree/master/locales) folder.

The format of the localization is:

```js
{
  …
  "day": 
  {
    "previous": "a day ago",
    "now": "today",
    "next": "in a day",
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

The `past` and `future` keys can be one of: `zero`, `one`, `two`, `few`, `many` and `other`. For more info on which is which read the [official Unicode CLDR documentation](http://cldr.unicode.org/index/cldr-spec/plural-rules). [Unicode CLDR][CLDR] (Common Locale Data Repository) is an industry standard and is basically a collection of formatting rules for all locales (date, time, currency, measurement units, numbers, etc).

One can also use raw Unicode CLDR locale rules which will be automatically converted to the format described above.

[Example for en-US-POSIX locale](https://github.com/unicode-cldr/cldr-dates-full/blob/master/main/en-US-POSIX/dateFields.json)

```js
{
  "main": {
    "en-US-POSIX": {
      "dates": {
        "fields": {
          …
          "day": {
            "displayName": "day",            // ignored
            "relative-type--1": "yesterday", // ignored
            "relative-type-0": "today",      // ignored
            "relative-type-1": "tomorrow",   // ignored
            "relativeTime-type-future": {
              "relativeTimePattern-count-one"   : "in {0} day",
              "relativeTimePattern-count-other" : "in {0} days"
            },
            "relativeTime-type-past": {
              "relativeTimePattern-count-one"   : "{0} day ago",
              "relativeTimePattern-count-other" : "{0} days ago"
            }
          },
          …
        }
      }
    }
  }
}
```

To add support for a specific language one can download the [CLDR dates package](https://github.com/unicode-cldr/cldr-dates-full/blob/master/main):

```
npm install cldr-dates-modern --save
```

And then add the neccessary locales from it:

```js
import javascript_time_ago from 'javascript-time-ago'
import russian from 'cldr-dates-modern/main/ru/dateFields.json'

javascript_time_ago.locale(russian)

const time_ago = new javascript_time_ago('ru')
time_ago.format(new Date(Date.now() - 60 * 1000))
// "1 минуту назад"
```

## Loading locales

No locales are loaded by default. This is done to allow tools like Webpack take advantage of code splitting to reduce the resulting javascript bundle size.

But server side doesn't need code splitting, so to load all available locales in Node.js one can use this shortcut:

```js
// A faster way to load all localization data for Node.js
// (`intl-messageformat` will load everything automatically when run in Node.js)
require('javascript-time-ago/load-all-locales')
```

## Customization

Localization data described in the above section can be further customized, for example, supporting `long` and `short` formats. Refer to [`locales/en.js`](https://github.com/halt-hammerzeit/javascript-time-ago/blob/master/locales/en.js) for an example.

Built-in localization data is presented in different variants. Example:

```js
import english from 'javascript-time-ago/locales/en'

english.tiny  // '1s', '2m', '3h', '4d', …
english.short // '1 sec. ago', '2 min. ago', …
english.long  // '1 second ago', '2 minutes ago', …
```

One can pass `options` as a second parameter to the `.format(date, options)` function. It's called a `style` (see `twitter` style for example). The `options` object can specify:

  * `flavour` – preferred labels style (e.g. `tiny`, `short`, `long`)
  * `units` – a list of time interval measurement units which can be used in the formatted output (e.g. `['second', 'minute', 'hour']`)
  * `gradation` – custom time interval measurement units scale
  * `override` – is a function of `{ elapsed, time, date, now }`. If the `override` function returns a value, then the `.format()` call will return that value. Otherwise it has no effect.

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
  * (some more `threshold` customization is possible, see the link below)
  * `granularity` can also be specified (for example, `5` for `minute` to allow only 5-minute intervals)

For more gradation examples see [`source/classify elapsed.js`](https://github.com/halt-hammerzeit/javascript-time-ago/blob/master/source/classify%20elapsed.js)

Available gradations:

```js
import { gradation } from 'javascript-time-ago'

gradation.canonical()  // '1 second ago', '2 minutes ago', …
gradation.convenient() // 'just now', '5 minutes ago', …
```

## Future

When given negative time intervals this library outputs future dates, like "in 5 minutes", "in a year", etc.

## React

There is also a [React component](https://github.com/halt-hammerzeit/react-time-ago).

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
[CLDR]: http://cldr.unicode.org/
[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
