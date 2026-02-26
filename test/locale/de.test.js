import { describe, it } from 'mocha'
import { expect } from 'chai'

import TimeAgo from '../../source/TimeAgo.js'
import de from '../../locale/de.json' with { type: 'json' }

TimeAgo.addLocale(de)

describe('locale/de', () => {
	it('should format "now"', () => {
		const timeAgo = new TimeAgo('de')
		expect(timeAgo.format(Date.now())).to.equal('gerade jetzt')
		expect(timeAgo.format(Date.now() + 100)).to.equal('in einem Moment')
	})
})