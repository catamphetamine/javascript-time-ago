import round from './round.js'
import roundMinute from './roundMinute.js'
// `approximate` style is deprecated.
import approximate from './approximate.js'
// `approximateTime` style is deprecated.
import approximateTime from './approximateTime.js'
import twitter from './twitter.js'
import twitterNow from './twitterNow.js'
import twitterMinute from './twitterMinute.js'
import twitterMinuteNow from './twitterMinuteNow.js'
import twitterFirstMinute from './twitterFirstMinute.js'
import mini from './mini.js'
import miniNow from './miniNow.js'
import miniMinute from './miniMinute.js'
import miniMinuteNow from './miniMinuteNow.js'

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