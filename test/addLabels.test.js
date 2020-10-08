import TimeAgo from '../source/TimeAgo'
import en from '../locale/en'
import { round } from '../steps'

describe('TimeAgo.addLocale', () => {
  it('should add and use custom labels', () => {
    TimeAgo.addLocale(en)

    const customLabels = {
      second: {
        past: {
          one: "{0} second earlier",
          other: "{0} seconds earlier"
        },
        future: {
          one: "{0} second later",
          other: "{0} seconds later"
        }
      }
    }

    TimeAgo.addLabels(customLabels, 'custom', 'en')

    const timeAgo = new TimeAgo('en-US')

    const customStyle = {
      steps: round,
      labels: 'custom'
    }

    timeAgo.format(Date.now() - 10 * 1000, customStyle).should.equal('10 seconds earlier')
  })

  it('should throw when locale has not been added', () => {
    expect(() => TimeAgo.addLabels({}, 'custom', 'exotic')).to.throw('No data for locale "exotic"')
  })
})