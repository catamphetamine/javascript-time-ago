import TimeAgo from '../../source/TimeAgo.js'
import de from '../../locale/de.json' assert { type: 'json' }

TimeAgo.addLocale(de)

describe('locale/de', () => {
	it('should format "now"', () => {
		const timeAgo = new TimeAgo('de')
		timeAgo.format(Date.now()).should.equal('gerade jetzt')
		timeAgo.format(Date.now() + 100).should.equal('in einem Moment')
	})
})