export default {
	steps: [
		{
			formatAs: 'second'
		},
		{
			formatAs: 'minute'
		},
		{
			formatAs: 'hour'
		},
		{
			formatAs: 'day'
		},
		{
			formatAs: 'month'
		},
		{
			formatAs: 'year'
		}
	],
	labels: [
		// "mini" labels are only defined for a few languages.
		'mini',
		// "short-time" labels are only defined for a few languages.
		'short-time',
		// "narrow" and "short" labels are defined for all languages.
		// "narrow" labels can sometimes be weird (like "+5d."),
		// but "short" labels have the " ago" part, so "narrow" seem
		// more appropriate.
		// "short" labels would have been more appropriate if they
		// didn't have the " ago" part, hence the "short-time" above.
		'narrow',
		// Since "narrow" labels are always present, "short" element
		// of this array can be removed.
		'short'
	]
}