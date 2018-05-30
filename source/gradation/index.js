// A gradation is a mapping from a time interval (in seconds)
// to the most appropriate time interval measurement unit
// for describing it, along with the amount of such units.
//
// E.g. for "canonical" gradation:
//
// 0 -> 1 'now'
// 0.5 -> 1 'second'
// 60 -> 1 'minute'
// 91 -> 2 'minute's
// ...
//
// Each gradation unit can have:
//
// * unit - (required) The name of the time interval measurement unit.
//
// * factor - (required) The amount of seconds will be divided by this number for this unit.
//
// * granularity - A step for the unit's resulting "amount" value.
//
// * threshold - Min value (in seconds) for this unit. Is required for non-first unit.
//
// * threshold_for_[unit] - A specific threshold required for moving from `[unit]` to this unit.
//                          E.g. if "now" unit is present in time units gradation
//                          then `threshold_for_now` can be set to `45` seconds.
//                          Otherwise, if "now" unit is omitted from time units gradation,
//                          then `elapsed(0)` will output "0 seconds" because there's no `threshold`.
//
// A user can supply his own gradation.
//
export { default as canonical } from './canonical'
export { default as convenient } from './convenient'
export { minute, hour, day, month, year, getStep, getDate } from './helpers'