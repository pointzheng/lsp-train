# 系统启动说明

这是馆藏分析平台的开发工程目录，为保证该目录下的源码能够在开发环境下正式运行，请按顺序执行如下步骤：

(1) 安装Node.js开发环境（安装Node.js的同时，包管理工具npm也进行了安装）。如果已经安装，请忽略次步骤。

(2) 初始化工程。本工程根目录下(LSP目录，下同)运行如下命令

```html
npm install
```

也可以安装[Yarn](https://yarnpkg.com/zh-Hans/)工具（与npm类似，管理Node.js的package），安装完毕后运行如下命令

```html
yarn install
```

(3) 启动开发环境。项目根目录下，通过终端运行如下命令

```html
npm start
```

**注意：** 开发环境下，此步骤可能比较慢，耐心等待即可。完成后终端有如下的类似提示

```html
... // 此前的终端提示，略
r-submit/tenantAPP-order-submit.css 1.87 kB {0} [built]
        [1] ./~/css-loader/lib/css-base.js 1.51 kB {0} [built]
webpack: Compiled with warnings.
```

(4) 浏览器下访问如下地址：

```html
http://localhost:7000
```

如果想更改服务的端口，请修改src下的配置文件webpack.config.js，对应的配置为

```html
// ... 其他配置，略

devServer: {
    contentBase: '/',
    host: 'localhost',
    port: 7000,
    inline: true,
    hot: true
}

// ... 其他配置，略
```

修改里面的7000即可。
