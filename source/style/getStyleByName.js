import round from './round'
import roundMinute from './roundMinute'
import approximate from './approximate'
import approximateTime from './approximateTime'
import twitter from './twitter'
import twitterFirstMinute from './twitterFirstMinute'

export default function getStyleByName(style) {
	switch (style) {
		// "default" style name is deprecated.
		case 'default':
		case 'round':
			return round
		case 'round-minute':
			return roundMinute
		case 'approximate':
			return approximate
		// "time" style name is deprecated.
		case 'time':
		case 'approximate-time':
			return approximateTime
		case 'twitter':
			return twitter
		case 'twitter-first-minute':
			return twitterFirstMinute
		default:
			// For historical reasons, the default style is "approximate".
			return approximate
	}
}