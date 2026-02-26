import { describe, it } from 'mocha'
import { expect } from 'chai'

import isStyleObject from './isStyleObject.js'

describe('isStyleObject', () => {
	it('should detect a style object', () => {
		expect(isStyleObject({
			gradation: []
		})).to.equal(true)
		expect(isStyleObject({
			steps: []
		})).to.equal(true)
		expect(isStyleObject({
			flavour: 'long'
		})).to.equal(true)
		expect(isStyleObject({
			flavour: ['long']
		})).to.equal(true)
		expect(isStyleObject({
			labels: 'long'
		})).to.equal(true)
		expect(isStyleObject({
			labels: ['long']
		})).to.equal(true)
		expect(isStyleObject({
			units: ['now']
		})).to.equal(true)
		expect(isStyleObject({
			future: true,
			round: 'floor',
			now: 0,
			getTimeToNextUpdate: true
		})).to.equal(false)
		expect(isStyleObject('round')).to.equal(false)
	})
})