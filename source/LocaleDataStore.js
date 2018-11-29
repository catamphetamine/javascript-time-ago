// Fallback locale.
// (when not a single one of the supplied "preferred" locales is available)
let defaultLocale = 'en'

// For all locales added
// their relative time formatter messages will be stored here.
const localesData = {}

export function getDefaultLocale() {
	return defaultLocale
}

export function setDefaultLocale(locale) {
	defaultLocale = locale
}

export function isLocaleDataAvailable(locale) {
	return localesData.hasOwnProperty(locale)
}

export function getLocaleData(locale) {
	return localesData[locale]
}

export function addLocaleData(localeData) {
	if (!localeData) {
		throw new Error('[javascript-time-ago] No locale data passed.')
	}
	// This locale data is stored in a global variable
	// and later used when calling `.format(time)`.
	localesData[localeData.locale] = localeData
}