import twitterMinute from './twitterMinute'

export default {
	...twitterMinute,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(twitterMinute.steps)
}