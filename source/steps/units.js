export const minute = 60 // in seconds

export const hour = 60 * minute // in seconds

export const day = 24 * hour // in seconds

export const week = 7 * day // in seconds

// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const month = 30.44 * day // in seconds

// "400 years have 146097 days (taking into account leap year rules)"
export const year = (146097 / 400) * day // in seconds