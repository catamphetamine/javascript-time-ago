// Chooses the most appropriate locale
// (one of the registered ones)
// based on the list of preferred `locales` supplied by the user.
//
// @param {string[]} locales - the list of preferable locales (in [IETF format](https://en.wikipedia.org/wiki/IETF_language_tag)).
// @param {Object} registered_locales - a map of available locales.
//
// @returns {string} The most suitable locale
//
// @example
// // Returns 'en'
// choose_locale(['en-US'], undefined, { 'ru', 'en' })
//
export default function choose_locale(locales, registered_locales)
{
	// This is not an intelligent algorythm,
	// but it will do for this library's case.
	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
	for (let locale of locales)
	{
		if (registered_locales[locale])
		{
			return locale
		}

		const parts = locale.split('-')
		while (parts.length > 1)
		{
			parts.pop()
			locale = parts.join('-')
			if (registered_locales[locale])
			{
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
export function intlDateTimeFormatSupportedLocale(locales)
{
	/* istanbul ignore else */
	if (intlDateTimeFormatSupported())
	{
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0]
	}
}
/**
 * Whether can use `Intl.DateTimeFormat`.
 * @return {boolean}
 */
export function intlDateTimeFormatSupported()
{
	// Babel transforms `typeof` into some "branches"
	// so istanbul will show this as "branch not covered".
	/* istanbul ignore next */
	const is_intl_available = typeof Intl === 'object'

	return is_intl_available && typeof Intl.DateTimeFormat === 'function'
}