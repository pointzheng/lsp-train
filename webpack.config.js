var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var antTheme = require("./src/styles/ant-theme.js");
var webpackUtil = require("./webpack.util.js");
var entries = webpackUtil.buildEntries();
var htmlPlugins = webpackUtil.buildHtmlPlugins();
var baseConf = require("./webpack.base.config.js");
const HappyPack = require('happypack');
var os = require('os');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
var nodeExternals = require("webpack-node-externals");
var loaders = baseConf.loaders.concat({
    test: /\.(js|jsx)$/,
    exclude: path.resolve(__dirname, "node_modules"),
    loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0&cacheDirectory=true'
});

var config = {
    devtool: 'cheap-module-source-map',
    entry: entries,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[id].chunk.js?[chunkhash]'
    },
    module: {
        loaders: loaders
    },
    resolve: {
        alias: {
          'bfd': path.join(__dirname, 'node_modules', 'bfd-ui', 'lib')
        }
    },
    plugins: htmlPlugins,
    babel: {
        plugins:[["import", [{ "libraryName": "antd", "style": true }]]]
    },
    devServer: {
        contentBase: '/',
        host: '0.0.0.0',
        port: 7000,
        inline: true,
        hot: true
    }
};

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = config;
