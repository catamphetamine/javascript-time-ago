# Migration from version `1.x`

### `.locale()` function removed.

If there're any `.locale()` static function calls then replace them with `.addLocale()`.

### `flavour`s that got renamed.

If any custom styles were defined replace the following `flavour`s in their definition:

* `short_convenient` -> `short-convenient`
* `long_convenient` -> `long-convenient`
* `short_time` -> `short-time`
* `long_time` -> `long-time`

### `RelativeTimeFormat` is no longer exported

If `RelativeTimeFormat` was imported from `javascript-time-ago` then it must now be imported from `relative-time-format` instead.