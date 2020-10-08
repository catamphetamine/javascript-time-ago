/**
 * Chooses the most appropriate locale
 * (one of the registered ones)
 * based on the list of preferred `locales` supplied by the user.
 *
 * @param {string[]} locales - the list of preferable locales (in [IETF format](https://en.wikipedia.org/wiki/IETF_language_tag)).
 * @param {Function} isLocaleDataAvailable - tests if a locale is available.
 *
 * @returns {string} The most suitable locale.
 *
 * @example
 * // Returns 'en'
 * chooseLocale(['en-US'], undefined, (locale) => locale === 'ru' || locale === 'en')
 */
export default function chooseLocale(locales, isLocaleDataAvailable) {
	// This is not an intelligent algorithm,
	// but it will do for this library's case.
	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
	for (let locale of locales) {
		if (isLocaleDataAvailable(locale)) {
			return locale
		}
		const parts = locale.split('-')
		while (parts.length > 1) {
			parts.pop()
			locale = parts.join('-')
			if (isLocaleDataAvailable(locale)) {
				return locale
			}
		}
	}

	throw new Error(`No locale data has been registered for any of the locales: ${locales.join(', ')}`)
}

/**
 * Whether can use `Intl.DateTimeFormat` for these `locales`.
 * Returns the first suitable one.
 * @param  {(string|string[])} locales
 * @return {?string} The first locale that can be used.
 */
export function intlDateTimeFormatSupportedLocale(locales) {
	/* istanbul ignore else */
	if (intlDateTimeFormatSupported()) {
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0]
	}
}

/**
 * Whether can use `Intl.DateTimeFormat`.
 * @return {boolean}
 */
export function intlDateTimeFormatSupported() {
	// Babel transforms `typeof` into some "branches"
	// so istanbul will show this as "branch not covered".
	/* istanbul ignore next */
	const isIntlAvailable = typeof Intl === 'object'
	return isIntlAvailable && typeof Intl.DateTimeFormat === 'function'
}
