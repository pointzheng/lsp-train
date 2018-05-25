var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var antTheme = require("./src/styles/ant-theme.js");

module.exports = { 
  loaders: [{
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
  }, {
    test: /\.less$/,
    loader: `style-loader!css-loader!less-loader?{modifyVars:${JSON.stringify(antTheme)}}`
  }, {
    test: /\.html$/,
    loader: "html?-minimize"
  }, {
    test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  }, {
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader?limit=8192&name=imgs/[hash].[ext]'
  }, {
    loader: 'json',
    test: /\.json$/,
  }]
};
