import twitter from './twitter.js'

export default {
	...twitter,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(twitter.steps)
}