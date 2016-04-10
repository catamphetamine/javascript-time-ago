# react-time-ago

[![NPM Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Test Coverage][coveralls-badge]][coveralls]

International relative date/time formatter along with a React component.

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
  * 1mo
  * 2 months
  * half a year
  * 1 year
  * 2yr
  * 5 years ago
  * … or whatever else

## Installation

**This package hasn't been released to npm yet. It will be released this week.**

```bash
npm install react-time-ago --save
```

This package assumes that the [`Intl`][Intl] global object exists in the runtime. `Intl` is present in all modern browsers _except_ Safari (which can be solved with the Intl polyfill).

Node.js 0.12 has the `Intl` APIs built-in, but only includes the English locale data by default. If your app needs to support more locales than English, you'll need to [get Node to load the extra locale data](https://github.com/nodejs/node/wiki/Intl), or (a much simpler approach) just install the Intl polyfill.

If you decide you need the Intl polyfill then [here are some basic installation and configuration instructions](#intl-polyfill-installation)

## Usage

```js
import react_time_ago from 'react-time-ago'

// Load locale specific relative date/time messages
import { short as english } from 'react-time-ago/locales/en'
import { long as russian }  from 'react-time-ago/locales/ru'

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
//
// If you are already using `react-intl` in your project
// and have already `require()`d `react-intl` locale data
// for these locales then this step is unnecessary
global.IntlMessageFormat = require('react-time-ago/node_modules/intl-messageformat')
require('react-time-ago/node_modules/intl-messageformat/dist/locale-data/en')
require('react-time-ago/node_modules/intl-messageformat/dist/locale-data/ru')
delete global.IntlMessageFormat

// Add locale specific relative date/time messages
react_time_ago.locale('en', english)
react_time_ago.locale('ru', russian)

// Initialization complete.
// Ready to format relative dates and times.

const time_ago_english = new react_time_ago('en-US')
console.log(time_ago_english.format(new Date()))

const time_ago_russian = new react_time_ago('ru-RU')
console.log(time_ago_russian.format(new Date()))
```

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

This library currently comes with English and Russian localization built-in, but any other locale can be added at runtime.

The built-in localization resides in the [`source/locales`](https://github.com/halt-hammerzeit/react-time-ago/tree/master/source/locales) folder.

The format of the localization is:

```js
{
  …
  "day": 
  {
    "previous": "yesterday",
    "next": "tomorrow",
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

The `past` and `future` keys can be one of: `zero`, `one`, `two`, `few`, `many` and `other`. For more info of which is which read the [official Unicode CLDR documentation](http://cldr.unicode.org/index/cldr-spec/plural-rules). [Unicode CLDR][CLDR] (Common Locale Data Repository) is an industry standard and is basically a collection of formatting rules for all locales (date, time, currency, measurement units, numbers, etc).

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
            "displayName": "day", // `displayName` field is not used
            "relative-type--1": "yesterday", // is optional
            "relative-type-0": "today", // this field is not used
            "relative-type-1": "tomorrow", // is optional
            "relativeTime-type-future": {
              "relativeTimePattern-count-one": "in {0} day",
              "relativeTimePattern-count-other": "in {0} days"
            },
            "relativeTime-type-past": {
              "relativeTimePattern-count-one": "{0} day ago",
              "relativeTimePattern-count-other": "{0} days ago"
            }
          },
          …
        }
      }
    }
  }
}
```

To add support for a specific language one can download the corresponding JSON file from [CLDR dates repository](https://github.com/unicode-cldr/cldr-dates-full/blob/master/main) and add the data from that file to the library:

```js
import react_time_ago from 'react-time-ago'
import russian from './CLDR/cldr-dates-full/main/ru/dateFields.json'

react_time_ago.locale('ru', russian.main.ru.dates.fields)

const time_ago = new react_time_ago('ru')
const text = time_ago.format(new Date())
```

## Customization

Localization data described in the above section can be further customized, for example, supporting "long" and "short" formats. Refer to `source/locales/en.js` for an example.

One can also pass options as a second parameter to the `.format(date, options)` function. The options are:

  * `units` – a list of time interval measurement units which can be used in the formatted output (e.g. `['second', 'minute', 'hour']`)
  * `gradation` – custom time interval measurement units gradation

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
    threshold: 60
  },
  {
    unit: 'hour',
    factor: 60 * 60,
    threshold: 60 * 60
  },
  …
]
```

  * `factor` is a divider for the supplied time interval (in seconds)
  * `threshold` is a minimum time interval value (in seconds) required for this gradation step
  * (some more `threshold` customization is possible, see the link below)

For more gradation examples see [`source/classify elapsed.js`](https://github.com/halt-hammerzeit/react-time-ago/blob/master/source/classify%20elapsed.js)

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

While actively developing, one can use (personally I don't use it)

```sh
npm run watch
```

in a terminal. This will watch the file system and run tests automatically 
whenever you save a js file.

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
[npm]: https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square
[npm-badge]: https://www.npmjs.org/package/react-time-ago
[travis]: https://travis-ci.org/halt-hammerzeit/react-time-ago
[travis-badge]: https://img.shields.io/travis/halt-hammerzeit/react-time-ago/master.svg?style=flat-square
[CLDR]: http://cldr.unicode.org/
[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[coveralls]: https://coveralls.io/r/halt-hammerzeit/react-time-ago?branch=master
[coveralls-badge]: https://img.shields.io/coveralls/halt-hammerzeit/react-time-ago/master.svg?style=flat-square
