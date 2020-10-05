// A preset (style) is an object having shape
// `{ units, gradation, flavour, custom({ elapsed, time, date, now, locale }) }`.
//
// `date` parameter of `custom()` is not guaranteed to be set (can be inferred from `time`).
//
export { default as timeStyle } from './time'
export { default as twitterStyle } from './twitter'
export { default as defaultStyle, default as approximateStyle } from './approximate'
export { default as preciseStyle } from './precise'