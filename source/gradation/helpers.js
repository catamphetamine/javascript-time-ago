export const day = 24 * 60 * 60 // in seconds

// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const month = 30.44 * day

// "400 years have 146097 days (taking into account leap year rules)"
export const year = (146097 / 400) * day