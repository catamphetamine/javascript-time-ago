import twitterMinute from './twitterMinute.js'

export default {
	...twitterMinute,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(twitterMinute.steps)
}