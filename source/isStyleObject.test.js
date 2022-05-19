import isStyleObject from './isStyleObject.js'

describe('isStyleObject', () => {
	it('should detect a style object', () => {
		isStyleObject({
			gradation: []
		}).should.equal(true)
		isStyleObject({
			steps: []
		}).should.equal(true)
		isStyleObject({
			flavour: 'long'
		}).should.equal(true)
		isStyleObject({
			flavour: ['long']
		}).should.equal(true)
		isStyleObject({
			labels: 'long'
		}).should.equal(true)
		isStyleObject({
			labels: ['long']
		}).should.equal(true)
		isStyleObject({
			units: ['now']
		}).should.equal(true)
		isStyleObject({
			future: true,
			round: 'floor',
			now: 0,
			getTimeToNextUpdate: true
		}).should.equal(false)
		isStyleObject('round').should.equal(false)
	})
})