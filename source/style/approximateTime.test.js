import TimeAgo from '../TimeAgo.js'
import approximateTime from './approximateTime.js'
import { day, month, year } from '../steps/units.js'

describe('style/approximate-time', () => {
	it('should format relative time (English)', () => {
		approximateScaleStepsTest([
			'just now',
			'1 minute',
			'2 minutes',
			'5 minutes',
			'10 minutes',
			'15 minutes',
			'20 minutes',
			'25 minutes',
			'30 minutes',
			'35 minutes',
			'40 minutes',
			'45 minutes',
			'50 minutes',
			'1 hour',
			'2 hours',
			'3 hours',
			'4 hours',
			'5 hours',
			'6 hours',
			'7 hours',
			'8 hours',
			'9 hours',
			'10 hours',
			'11 hours',
			'12 hours',
			'13 hours',
			'14 hours',
			'15 hours',
			'16 hours',
			'17 hours',
			'18 hours',
			'19 hours',
			'20 hours',
			'1 day',
			'2 days',
			'3 days',
			'4 days',
			'5 days',
			'1 week',
			'2 weeks',
			'3 weeks',
			'1 month',
			'2 months',
			'3 months',
			'4 months',
			'5 months',
			'6 months',
			'7 months',
			'8 months',
			'9 months',
			'9 months',
			'10 months',
			'1 year',
			'2 years',
			'3 years',
			'100 years'
		],
		'en-US')
	})

	it('should format relative time (Russian)', () => {
		approximateScaleStepsTest([
			'только что',
			'1 минута',
			'2 минуты',
			'5 минут',
			'10 минут',
			'15 минут',
			'20 минут',
			'25 минут',
			'30 минут',
			'35 минут',
			'40 минут',
			'45 минут',
			'50 минут',
			'1 час',
			'2 часа',
			'3 часа',
			'4 часа',
			'5 часов',
			'6 часов',
			'7 часов',
			'8 часов',
			'9 часов',
			'10 часов',
			'11 часов',
			'12 часов',
			'13 часов',
			'14 часов',
			'15 часов',
			'16 часов',
			'17 часов',
			'18 часов',
			'19 часов',
			'20 часов',
			'1 день',
			'2 дня',
			'3 дня',
			'4 дня',
			'5 дней',
			'1 неделю',
			'2 недели',
			'3 недели',
			'1 месяц',
			'2 месяца',
			'3 месяца',
			'4 месяца',
			'5 месяцев',
			'6 месяцев',
			'7 месяцев',
			'8 месяцев',
			'9 месяцев',
			'9 месяцев',
			'10 месяцев',
			'1 год',
			'2 года',
			'3 года',
			'100 лет'
		],
		'ru-RU')
	})
})

function approximateScaleStepsTest(labels, timeAgo) {
	if (typeof timeAgo === 'string') {
		timeAgo = new TimeAgo(timeAgo)
	}

	const now = Date.now()
	const elapsed = time => timeAgo.format(now - time * 1000, 'approximate-time', { now })

	if (approximateScaleSteps.length !== labels.length) {
		throw new Error(`Array length mismatch. Steps: ${approximateScaleSteps.length}, labels: ${labels.length}`)
	}

	let i = 0
	while (i < approximateScaleSteps.length) {
		for (let time of approximateScaleSteps[i]) {
			elapsed(time).should.equal(labels[i])
		}
		i++
	}
}

const approximateScaleSteps =
[
	// 'just now':
	[
		0,
		40.49
	],
	// '1 minute ago':
	[
		45.5,
		1.49 * 60
	],
	// '2 minutes ago':
	[
		1.51 * 60,
		2.49 * 60
	],
	// '5 minutes ago':
	[
		2.51 * 60,
		7.49 * 60
	],
	// '10 minutes ago':
	[
		7.51  * 60,
		12.49 * 60
	],
	// '15 minutes ago':
	[
		12.51 * 60,
		17.49 * 60
	],
	// '20 minutes ago':
	[
		17.51 * 60,
		22.49 * 60
	],
	// '25 minutes ago':
	[
		22.51 * 60,
		27.49 * 60
	],
	// '30 minutes ago':
	[
		27.51 * 60,
		32.49 * 60
	],
	// '35 minutes ago':
	[
		32.51 * 60,
		37.49 * 60
	],
	// '40 minutes ago':
	[
		37.51 * 60,
		42.49 * 60
	],
	// '45 minutes ago':
	[
		42.51 * 60,
		47.49 * 60
	],
	// '50 minutes ago':
	[
		47.51 * 60,
		52.49 * 60
	],
	// '1 hour ago':
	[
		55.01 * 60,
		1.49  * 60 * 60
	],
	// '2 hours ago':
	[
		1.51  * 60 * 60,
		2.49  * 60 * 60
	],
	// '3 hours ago':
	[
		2.51  * 60 * 60,
		3.49  * 60 * 60
	],
	// '4 hours ago':
	[
		3.51  * 60 * 60,
		4.49  * 60 * 60
	],
	// '5 hours ago':
	[
		4.51  * 60 * 60,
		5.49  * 60 * 60
	],
	// '6 hours ago':
	[
		5.51  * 60 * 60,
		6.49  * 60 * 60
	],
	// '7 hours ago':
	[
		6.51  * 60 * 60,
		7.49  * 60 * 60
	],
	// '8 hours ago':
	[
		7.51  * 60 * 60,
		8.49  * 60 * 60
	],
	// '9 hours ago':
	[
		8.51  * 60 * 60,
		9.49  * 60 * 60
	],
	// '10 hours ago':
	[
		9.51  * 60 * 60,
		10.49 * 60 * 60
	],
	// '11 hours ago':
	[
		10.51 * 60 * 60,
		11.49 * 60 * 60
	],
	// '12 hours ago':
	[
		11.51 * 60 * 60,
		12.49 * 60 * 60
	],
	// '13 hours ago':
	[
		12.51 * 60 * 60,
		13.49 * 60 * 60
	],
	// '14 hours ago':
	[
		13.51 * 60 * 60,
		14.49 * 60 * 60
	],
	// '15 hours ago':
	[
		14.51 * 60 * 60,
		15.49 * 60 * 60
	],
	// '16 hours ago':
	[
		15.51 * 60 * 60,
		16.49 * 60 * 60
	],
	// '17 hours ago':
	[
		16.51 * 60 * 60,
		17.49 * 60 * 60
	],
	// '18 hours ago':
	[
		17.51 * 60 * 60,
		18.49 * 60 * 60
	],
	// '19 hours ago':
	[
		18.51 * 60 * 60,
		19.49 * 60 * 60
	],
	// '20 hours ago':
	[
		19.51 * 60 * 60,
		20.49 * 60 * 60
	],
	// '1 day ago':
	[
		20.51 * 60 * 60,
		1.49  * day
	],
	// '2 days ago':
	[
		1.51  * day,
		2.49  * day
	],
	// '3 days ago':
	[
		2.51  * day,
		3.49  * day
	],
	// '4 days ago':
	[
		3.51  * day,
		4.49  * day
	],
	// '5 days ago':
	[
		4.51  * day,
		5.49  * day
	],
	// '1 week ago':
	[
		5.51  * day,
		1.49  * 7 * day
	],
	// '2 weeks ago':
	[
		1.51  * 7 * day,
		2.49  * 7 * day
	],
	// '3 weeks ago':
	[
		2.51  * 7 * day,
		3.49  * 7 * day
	],
	// '1 month ago':
	[
		3.51  * 7 * day,
		1.49  * month
	],
	// '2 months ago':
	[
		1.51  * month,
		2.49  * month
	],
	// '3 months ago':
	[
		2.51  * month,
		3.49  * month
	],
	// '4 months ago':
	[
		3.51  * month,
		4.49  * month
	],
	// '5 months ago':
	[
		4.51  * month,
		5.49  * month
	],
	// '6 months ago':
	[
		5.51  * month,
		6.49  * month
	],
	// '7 months ago':
	[
		6.51  * month,
		7.49  * month
	],
	// '8 months ago':
	[
		7.51  * month,
		8.49  * month
	],
	// '9 months ago':
	[
		8.51  * month,
		8.99  * month
	],
	// '9 months ago':
	[
		9.01  * month,
		9.49  * month
	],
	// '10 months ago':
	[
		9.51  * month,
		10.49  * month
	],
	// '1 year ago':
	[
		10.51 * month,
		1.49  * year
	],
	// '2 years ago':
	[
		1.51  * year,
		2.49  * year
	],
	// '3 years ago':
	[
		2.51  * year,
		3.49  * year
	],
	// '100 years ago':
	[
		99.51  * year,
		100.49 * year
	]
]