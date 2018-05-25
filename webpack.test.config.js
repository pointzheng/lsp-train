var webpack = require('webpack');
var baseConf = require("./webpack.base.config.js");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var loaders = baseConf.loaders.concat({
  exclude: /node_modules/,
  loader: 'babel',
  test: /\.(js|jsx)$/,
  query: {
    presets: ['es2015'],
    plugins: ['istanbul']
  }
});
module.exports = {
  module: {
    loaders: loaders
  },
  plugins: [
		new ExtractTextPlugin('css/[name].css')
	]
};
