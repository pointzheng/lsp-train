var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * 构建html页面的html-webpack-plugin
 * @return {[type]}         [description]
 */
function buildHtmlPlugins() {
  var htmlPlugins = [
      new ExtractTextPlugin('css/[name].css'),
      new HotModuleReplacementPlugin(),
  ];

  // 加入index和login页面的相应文件
  var commonInfo = {
    inject: true,
    favicon: './src/imgs/favicon.ico',
    hash: true,
    minify: {
        removeComments: true,
        collapseWhitespace: false
    }
  };
  var indexHtml = Object.assign({
    filename: './index.html',
    template: './src/index.html',
    chunks: ['index']
  }, commonInfo);
  htmlPlugins.push(new HtmlWebpackPlugin(indexHtml));

  // 业务页面文件
  var pages = getEntry('js', 'src/pages/');
  var pagenames = Object.keys(pages);

  pagenames.forEach(function (pagename) {
      var fullPathName = pages[pagename],
          htmlFile = fullPathName.replace(/(\/[a-zA-Z0-9\-]*)\.(js|jsx)$/, "$1.html"),
          tmplFile;

      if (glob.sync(htmlFile).length == 1) {
        // console.log("html文件存在：" + htmlFile + "，使用该文件!");
        tmplFile = htmlFile;
      } else {
        tmplFile = "./src/tmpl/biz-page.html";
        // console.log("html文件不存在：" + htmlFile + "，使用默认模板文件：" + tmplFile);
      }

      var conf = {
          filename: './pages/' + pagename + '.html',
          // template: pages[pagename], // TODO：此处可优化，改成通用的模板即可
          template: tmplFile,
          minify: {
              removeComments: true,
              collapseWhitespace: false
          },
          favicon: './src/imgs/favicon.ico',
          inject: true,
          chunks: [pagename],
          hash: true
      };
      htmlPlugins.push(new HtmlWebpackPlugin(conf));
  });

  return htmlPlugins;
}

/**
 * 构建系统的所有入口文件
 * @return {[type]} [description]
 */
function buildEntries() {
  var _entries = getEntry('js', 'src/pages/');
  _entries['login'] = './src/pages/login/login.js';
  _entries['index'] = './src/index.js';
  

  return _entries;
}

/**
 * 在给定路径下，查找相应文件类型（js，html等）的所有文件
 * @param  {[type]} fileType 文件类型，只能取：html, js, css 3个值
 * @param  {[type]} pathDir  路径
 * @return {[type]}          标准JSON描述的文件名到文件完整路径名称的映射，如{"change-password.html": "./src/pages/account/my-account/change-password/change-password.html"}
 */
function getEntry(fileType, pathDir) {
  if (fileType !== "js" && fileType !== "html" && fileType !== "css") {
    throw new Error("错误的文件类型：" + fileType);
  }

  var globPath = pathDir + "**/*." + fileType;
  var files = glob.sync(globPath);
  var _entries = {},
    entry, dirname, basename, pathname, extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
    _entries[basename] = './' + entry;
  }

  return _entries;
}

module.exports = {
  buildHtmlPlugins: buildHtmlPlugins,
  buildEntries: buildEntries
};
