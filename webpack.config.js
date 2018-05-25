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
    // exclude: /node_modules/,
    exclude: path.resolve(__dirname, "node_modules"),

    // TODO：保留下面注释语句，待后续对打包性能进行完善
    // include: resolve('src'),
    // exclude: resolve('node_modules'),
    // target: 'node', // in order to ignore built-in modules like path, fs, etc.
    // externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    // loader: 'happypack/loader?id=happybabel'
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
            'react': path.join(__dirname, 'node_modules', 'react','dist','react.min.js'),
            'react-dom': path.join(__dirname, 'node_modules', 'react-dom','dist','react-dom.min.js'),
            'jquery': path.join(__dirname, 'node_modules', 'jquery','dist','jquery.min.js'),
            'jquery-custom': path.join(__dirname, 'src', 'plugins','jquery-custom','jquery-custom.js'),
            'react-bootstrap': path.join(__dirname, 'node_modules', 'react-bootstrap','dist','react-bootstrap.min.js'),
            'babel-polyfill': path.join(__dirname, 'node_modules', 'babel-polyfill','dist','polyfill.min.js'),
            'bfd': path.join(__dirname, 'node_modules', 'bfd-ui', 'lib')
        }
    },
    plugins: htmlPlugins/*.concat(new HappyPack({
     id: 'happybabel',
     loaders: ['babel-loader'],
     threadPool: happyThreadPool,
     cache: true,
     verbose: true
     }))*/,
    babel:{
        plugins:[["import", [{ "libraryName": "antd", "style": true }]]]
    },
    devServer: {
        //devtool: '#source-map',
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
