// A preset (style) is an object having shape
// `{ units, gradation, flavour, custom({ elapsed, time, date, now, locale }) }`.
//
// `date` parameter of `custom()` is not guaranteed to be set (can be inferred from `time`).
//
export { default as time } from './time'
export { default as twitter } from './twitter'