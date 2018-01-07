import parse_CLDR from '../source/cldr'
import english from './locales/en-cldr'
import { short as english_short, long as english_long } from '../locales/en'

describe(`CLDR`, function()
{
	it(`should parse Unicode CLDR locale data`, function()
	{
		parse_CLDR(english).should.deep.equal(converted_CLDR)
	})
})

const converted_CLDR =
{
  "long": {
    "year": {
      "past": {
        "one": "{0} year ago",
        "other": "{0} years ago"
      },
      "future": {
        "one": "in {0} year",
        "other": "in {0} years"
      }
    },
    "month": {
      "past": {
        "one": "{0} month ago",
        "other": "{0} months ago"
      },
      "future": {
        "one": "in {0} month",
        "other": "in {0} months"
      }
    },
    "week": {
      "past": {
        "one": "{0} week ago",
        "other": "{0} weeks ago"
      },
      "future": {
        "one": "in {0} week",
        "other": "in {0} weeks"
      }
    },
    "day": {
      "past": {
        "one": "{0} day ago",
        "other": "{0} days ago"
      },
      "future": {
        "one": "in {0} day",
        "other": "in {0} days"
      }
    },
    "hour": {
      "past": {
        "one": "{0} hour ago",
        "other": "{0} hours ago"
      },
      "future": {
        "one": "in {0} hour",
        "other": "in {0} hours"
      }
    },
    "minute": {
      "past": {
        "one": "{0} minute ago",
        "other": "{0} minutes ago"
      },
      "future": {
        "one": "in {0} minute",
        "other": "in {0} minutes"
      }
    },
    "second": {
      "past": {
        "one": "{0} second ago",
        "other": "{0} seconds ago"
      },
      "future": {
        "one": "in {0} second",
        "other": "in {0} seconds"
      }
    },
    "just-now": {
      "past": {
        "other": "now"
      },
      "future": {
        "other": "now"
      }
    }
  },
  "short": {
    "year": {
      "past": {
        "one": "{0} yr. ago",
        "other": "{0} yr. ago"
      },
      "future": {
        "one": "in {0} yr.",
        "other": "in {0} yr."
      }
    },
    "month": {
      "past": {
        "one": "{0} mo. ago",
        "other": "{0} mo. ago"
      },
      "future": {
        "one": "in {0} mo.",
        "other": "in {0} mo."
      }
    },
    "week": {
      "past": {
        "one": "{0} wk. ago",
        "other": "{0} wk. ago"
      },
      "future": {
        "one": "in {0} wk.",
        "other": "in {0} wk."
      }
    },
    "day": {
      "past": {
        "one": "{0} day ago",
        "other": "{0} days ago"
      },
      "future": {
        "one": "in {0} day",
        "other": "in {0} days"
      }
    },
    "hour": {
      "past": {
        "one": "{0} hr. ago",
        "other": "{0} hr. ago"
      },
      "future": {
        "one": "in {0} hr.",
        "other": "in {0} hr."
      }
    },
    "minute": {
      "past": {
        "one": "{0} min. ago",
        "other": "{0} min. ago"
      },
      "future": {
        "one": "in {0} min.",
        "other": "in {0} min."
      }
    },
    "second": {
      "past": {
        "one": "{0} sec. ago",
        "other": "{0} sec. ago"
      },
      "future": {
        "one": "in {0} sec.",
        "other": "in {0} sec."
      }
    },
    "just-now": {
      "past": {
        "other": "now"
      },
      "future": {
        "other": "now"
      }
    }
  }
}