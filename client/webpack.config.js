var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /npde_modules/,
      loader: 'babel-loader'
    }]
  }
};
