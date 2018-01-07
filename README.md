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

## Installation

```
npm install intl-messageformat --save
npm install javascript-time-ago --save
```

This package assumes that the [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object exists in the runtime. `Intl` is present in all modern browsers [_except_ Internet Explorer 10 and Safari 9](http://caniuse.com/#search=intl) (which can be solved with the Intl polyfill).

Node.js starting from `0.12` has the `Intl` APIs built-in, but only includes English locale data by default. If your app needs to support more locales than English on server side then you'll need to [get Node to load the extra locale data](https://github.com/nodejs/node/wiki/Intl), or (a much simpler approach) just use the Intl polyfill.

If you decide you need the Intl polyfill then [here are some basic installation and configuration instructions](#intl-polyfill-installation).

## Usage

First, the library must be initialized with a set of desired locales.

#### ./javascript-time-ago.js

```js
// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
//
// `IntlMessageFormat` global variable must exist
// in order for this to work:
// https://github.com/yahoo/intl-messageformat/issues/159
// For Webpack this is done via `ProvidePlugin` (see below).
//
import 'intl-messageformat/dist/locale-data/en'
import 'intl-messageformat/dist/locale-data/ru'

// Time ago formatter.
import javascriptTimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locales/en'
import ru from 'javascript-time-ago/locales/ru'

// Add locale-specific relative date/time formatting rules.
javascriptTimeAgo.locale(en)
javascriptTimeAgo.locale(ru)
```

`javascript-time-ago` uses `intl-messageformat` internally. [`IntlMessageFormat`](https://github.com/yahoo/intl-messageformat) is a helper library made by Yahoo which formats plurals internationally (e.g. "1 second", "2 seconds", etc).

Both these libraries must be initialized with a set of desired locales first. For that, `IntlMessageFormat` [needs to be accessible as a global variable](https://github.com/yahoo/intl-messageformat/issues/159) (though I don't agree with such a design choice). For Webpack that would be:

```js
plugins: [
  new webpack.ProvidePlugin({
    IntlMessageFormat: ['intl-messageformat', 'default'],
  }),
  // ...
]
```

After the initialization step is complete it is ready to format relative dates.

```js
import javascriptTimeAgo from 'javascript-time-ago'

const timeAgoEnglish = new javascriptTimeAgo('en-US')

timeAgoEnglish.format(new Date())
// "just now"

timeAgoEnglish.format(new Date(Date.now() - 60 * 1000))
// "a minute ago"

timeAgoEnglish.format(new Date(Date.now() - 2 * 60 * 60 * 1000))
// "2 hours ago"

timeAgoEnglish.format(new Date(Date.now() - 24 * 60 * 60 * 1000))
// "a day ago"

const timeAgoRussian = new javascriptTimeAgo('ru-RU')

timeAgoRussian.format(new Date())
// "только что"

timeAgoRussian.format(new Date(Date.now() - 60 * 1000)))
// "минуту назад"

timeAgoRussian.format(new Date(Date.now() - 2 * 60 * 60 * 1000)))
// "2 часа назад"

timeAgoRussian.format(new Date(Date.now() - 24 * 60 * 60 * 1000))
// "днём ранее"
```

## Twitter style

Mimics Twitter style of time ago ("1m", "2h", "Mar 3", "Apr 4, 2012")

```js
…
const timeAgo = new javascriptTimeAgo('en-US')

// A `style` is simply an `options` object 
// passed to the `.format()` function as a second parameter.
const twitter = timeAgo.style.twitter()

timeAgo.format(new Date(), twitter)
// ""

timeAgo.format(new Date(Date.now() - 60 * 1000), twitter)
// "1m"

timeAgo.format(new Date(Date.now() - 2 * 60 * 60 * 1000), twitter)
// "2h"
```

## Fuzzy style

```js
timeAgo.style.fuzzy()
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

## Thread safety

Since thread safety is hard most likely `intl-messageformat` isn't thread safe. Same goes for `Intl.DateTimeFormat` (both native and polyfill): most likely they aren't thread safe either. Therefore `javascript-time-ago` should be considered non-thread-safe.

But it doesn't really matter because javascript is inherently single-threaded: both in a web browser and in Node.js.

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

The built-in localization resides in the [`locales`](https://github.com/catamphetamine/javascript-time-ago/tree/master/locales) folder.

The format of the localization is:

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

One can also pass raw Unicode CLDR locale data `.json` files (found in [CLDR repository](https://github.com/unicode-cldr/cldr-dates-full/blob/master/main/)) which will be automatically converted by this library to the format described above.

[Example CLDR data for en-US-POSIX locale](https://github.com/unicode-cldr/cldr-dates-full/blob/master/main/en-US-POSIX/dateFields.json)

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

So, to add support for a specific language one can install [CLDR dates package](https://github.com/unicode-cldr/cldr-dates-full/blob/master/main):

```
npm install cldr-dates-modern --save
```

And then add the neccessary locales from it:

```js
import javascriptTimeAgo from 'javascript-time-ago'
import ru from 'cldr-dates-modern/main/ru/dateFields.json'

javascriptTimeAgo.locale(ru)

const timeAgo = new javascriptTimeAgo('ru')
timeAgo.format(new Date(Date.now() - 60 * 1000))
// "1 минуту назад"
```

## Loading locales

No locales are loaded by default. This is done to allow tools like Webpack take advantage of code splitting to reduce the resulting javascript bundle size.

On the other hand, server side doesn't need code splitting, so to load all available locales in Node.js one can use this shortcut:

```js
// A faster way to load all localization data for Node.js
// (`intl-messageformat` will load everything automatically when run in Node.js)
require('javascript-time-ago/load-all-locales')
```

## Customization

Localization data described in the above section can be further customized, for example, supporting `long` and `short` formats. Refer to [`locales/en.js`](https://github.com/catamphetamine/javascript-time-ago/blob/master/locales/en.js) for an example.

Built-in localization data is presented in different variants:

```js
import english from 'javascript-time-ago/locales/en'

english.tiny  // '1s', '2m', '3h', '4d', …
english.short // '1 sec. ago', '2 min. ago', …
english.long  // '1 second ago', '2 minutes ago', …
```

One can pass `style` as a second parameter to the `.format(date, style)` function. The `style` object can specify:

  * `flavour` – preferred labels variant (e.g. `tiny`, `short`, `long`)
  * `units` – a list of time interval measurement units which can be used in the formatted output (e.g. `['second', 'minute', 'hour']`)
  * `gradation` – custom time interval measurement units scale
  * `override` – is a function of `{ elapsed, time, date, now }`. If the `override` function returns a value, then the `.format()` call will return that value. Otherwise the date/time is formatter as usual.

(see `twitter` style for an example)

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

## Future

When given future dates `.format()` produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

## React

There is also a [React component](https://github.com/catamphetamine/react-time-ago) built upon this library which autorefreshes itself.

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