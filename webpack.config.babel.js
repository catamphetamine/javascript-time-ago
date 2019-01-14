import path from 'path'

const libraryName = 'javascript-time-ago'

module.exports = {
  entry: path.join(__dirname, '/index.js'),
  devtool: 'source-map',
  output: {
    path           : path.join(__dirname, '/bundle'),
    filename       : `${libraryName}.min.js`,
    library        : libraryName,
    libraryTarget  : 'umd',
    umdNamedDefine : true
  },
  module: {
    rules: [{
      test    : /(\.js)$/,
      loader  : 'babel-loader',
      exclude : /node_modules/
    }, {
      test    : /(\.json)$/,
      loader  : 'json-loader'
    }]
  }
}