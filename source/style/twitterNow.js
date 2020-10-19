import twitter from './twitter'

export default {
	...twitter,
	// Add "now".
	steps: [{ formatAs: 'now' }].concat(twitter.steps)
}