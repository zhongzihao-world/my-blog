const path = require('path');
const resolve = relativePath => path.resolve(__dirname, relativePath);

module.exports = {
  // mode: 'development',
  mode: 'production',
  devtool: 'source-map',
  entry: resolve('./index.js'),
  output: {
    path: resolve('./dist'),
  }
};