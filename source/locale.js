// Chooses the most appropriate locale
// (one of the registered ones)
// based on the list of preferred `locales` supplied by the user.
//
// @param {string[]} locales - the list of preferable locales (in [IETF format](https://en.wikipedia.org/wiki/IETF_language_tag)).
// @param {string[]} registered_locales - an array of available locales.
//
// @returns {string} Returns the most suitable locale
//
// @example
// // Returns 'en'
// choose_locale(['en-US'], undefined, ['ru', 'en'])
//
export default function choose_locale(locales, registered_locales)
{
	// This is not an intelligent algorythm,
	// but it will do for this library's case.
	for (const locale of locales)
	{
		if (registered_locales.indexOf(locale) >= 0)
		{
			return locale
		}

		const language = get_language_from_locale(locale)

		if (language !== locale)
		{
			if (registered_locales.indexOf(language) >= 0)
			{
				return language
			}
		}
	}

	throw new Error(`No locale data has been registered for any of the locales: ${locales.join(', ')}`)
}

/**
 * Extracts language from locale (in IETF format).
 * @param {string} locale
 * @return {string} language
 */
function get_language_from_locale(locale)
{
	// `locale` can be, for example,
	// "he-IL-u-ca-hebrew-tz-jeruslm" or "ar-u-nu-latn".

	const hyphen_index = locale.indexOf('-')

	if (hyphen_index > 0)
	{
		return locale.slice(0, hyphen_index)
	}

	return locale
}

/**
 * Whether can use `Intl.DateTimeFormat` for these `locales`.
 * Returns the first suitable one.
 * @param  {(string|string[])} locales
 * @return {string} The first locale that can be used.
 */
export function intl_supported_locale(locales)
{
	if (typeof Intl === 'object' && Intl.DateTimeFormat)
	{
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0]
	}
}