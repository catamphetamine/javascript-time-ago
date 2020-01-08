import JavascriptTimeAgo from '../..'
import de from '../../locale/de'

JavascriptTimeAgo.addLocale(de)

describe('locale/de', () => {
	it('should format "now" in "long-convenient" style', () => {
		const timeAgo = new JavascriptTimeAgo('de')
		timeAgo.format(Date.now()).should.equal('gerade jetzt')
		timeAgo.format(Date.now() + 100).should.equal('in einem Moment')
	})
})