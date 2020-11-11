import round from './round'
import roundMinute from './roundMinute'
// `approximate` style is deprecated.
import approximate from './approximate'
// `approximateTime` style is deprecated.
import approximateTime from './approximateTime'
import twitter from './twitter'
import twitterNow from './twitterNow'
import twitterMinute from './twitterMinute'
import twitterMinuteNow from './twitterMinuteNow'
import twitterFirstMinute from './twitterFirstMinute'
import mini from './mini'
import miniNow from './miniNow'
import miniMinute from './miniMinute'
import miniMinuteNow from './miniMinuteNow'

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
		case 'mini':
			return mini
		case 'mini-now':
			return miniNow
		case 'mini-minute':
			return miniMinute
		case 'mini-minute-now':
			return miniMinuteNow
		case 'twitter':
			return twitter
		case 'twitter-now':
			return twitterNow
		case 'twitter-minute':
			return twitterMinute
		case 'twitter-minute-now':
			return twitterMinuteNow
		case 'twitter-first-minute':
			return twitterFirstMinute
		default:
			// For historical reasons, the default style is "approximate".
			return approximate
	}
}