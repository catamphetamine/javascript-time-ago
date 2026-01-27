export { default } from './modules/TimeAgo.js'

export { default as FullDateFormatter } from './modules/FullDateFormatter.js'

// These two legacy exports are deprecated.
export {
	intlDateTimeFormatSupported as intlDateTimeFormatSupported,
	intlDateTimeFormatSupportedLocale as intlDateTimeFormatSupportedLocale
} from './modules/locale.js'