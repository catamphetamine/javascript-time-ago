// A preset (style) is an object having shape
// `{ units, gradation, flavour, override({ elapsed, time, date, now, locale }) }`.
//
// `date` parameter of `override()` is not guaranteed to be set (can be inferred from `time`).
//
export { default as time } from './time'
export { default as twitter } from './twitter'