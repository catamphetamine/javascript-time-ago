// Chooses the most appropriate locale
// (one of the registered ones)
// based on the list of preferred `locales` supplied by the user.
//
// @param {string[]} locales - the list of preferable locales.
// @param {string[]} registered_locales - an array of available locales.
//
// @returns {string} Returns the most suitable locale
//
// @example
// // Returns 'en'
// resolve_locale(['en-US'], undefined, ['ru', 'en'])
//
export default function resolve_locale(locales, registered_locales)
{
	// Using "the set of locales + the default locale", we look for the first one
	// which that has been registered. When data does not exist for a locale, we
	// traverse its ancestors to find something that's been registered within
	// its hierarchy of locales. Since we lack the proper `parentLocale` data
	// here, we must take a naive approach to traversal.
	for (const locale of locales)
	{
		// Split locale into parts.
		// E.g. "en-US" -> ["en", "US"].
		const locale_parts = locale.split('-')

		// Try all possible variants:
		// from the longest one to the shortest one.
		while (locale_parts.length > 0)
		{
			// Convert locale parts back to a string.
			// E.g. ["en", "US"] -> "en-US".
			const locale_try = locale_parts.join('-')

			// If this locale is registered then return it.
			// Locales registered may be specific ones
			// e.g. "en-US" or "en-US-POSIX".
			// Therefore match using a substring
			// so that "en" is still found in the aforementioned case.
			for (const registered_locale of registered_locales)
			{
				if (registered_locale.indexOf(locale_try) === 0)
				{
					return locale_try
				}
			}

			// Try a shorter one.
			locale_parts.pop()
		}
	}

	throw new Error(`No locale data has been registered for any of the locales: ${locales.join(', ')}`)
}