import twitter from './twitter'
import approximateTime from './approximateTime'
import approximate from './approximate'
import round from './round'
import roundMinute from './roundMinute'

export default function getStyleByName(style) {
	switch (style) {
		case 'twitter':
			return twitter
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
		default:
			// For historical reasons, the default style is "approximate".
			return approximate
	}
}