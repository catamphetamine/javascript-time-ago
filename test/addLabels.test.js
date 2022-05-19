import TimeAgo from './TimeAgo.js'
import en from '../locale/en.json'

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

    TimeAgo.addLabels('en', 'custom', customLabels)

    const timeAgo = new TimeAgo('en-US')

    const customStyle = {
      steps: [
        {
          formatAs: 'now'
        },
        {
          formatAs: 'second'
        },
        {
          formatAs: 'minute'
        },
        {
          formatAs: 'hour'
        },
        {
          formatAs: 'day'
        },
        {
          formatAs: 'week'
        },
        {
          formatAs: 'month'
        },
        {
          formatAs: 'year'
        }
      ],
      labels: 'custom'
    }

    timeAgo.format(Date.now() - 10 * 1000, customStyle).should.equal('10 seconds earlier')
  })

  it('should work when no locale data has been added before for the locale', () => {
    const locale = 'xxx'
    let timeAgo = new TimeAgo(locale)
    timeAgo.locale.should.equal(TimeAgo.getDefaultLocale())
    TimeAgo.addLabels(locale, 'custom', {
      "second": {
        "past": "about {0} seconds ago",
        "future": "in about {0} seconds"
      }
    })
    timeAgo = new TimeAgo(locale)
    timeAgo.locale.should.equal(locale)
    timeAgo.format(Date.now() - 10 * 1000, {
      labels: 'custom',
      steps: [{
        formatAs: 'second'
      }, {
        // This step will be filtered out
        // because "now" unit labels aren't available.
        formatAs: 'now',
        minTime: 0
      }]
    }).should.equal('about 10 seconds ago')
    // expect(() => TimeAgo.addLabels('exotic', 'custom', {})).to.throw('No data for locale "exotic"')
  })
})