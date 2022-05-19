// This file id deprecated.
// It's the same as `index.cjs`, just with an added `.js` file extension.
// It only exists for compatibility with the software that doesn't like `*.cjs` file extension.
// https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/61#note_950728292

exports = module.exports = require('../commonjs/PropTypes.js')
exports['default'] = require('../commonjs/PropTypes.js')