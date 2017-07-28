# vue-multiple-page

## 简介

该项目为日常项目开发中抽离的一个脚手架，目的是为了方便后续开发。脚手架默认配置es6-7-8＋cssnext+vue开发环境，但并不仅限于用vue做开发。并对webpack打包流程做了优化处理。支持单页／多页面开发，支持代码切割异步加载，有兴趣者请参阅[webpack中文文档#代码分离](https://doc.webpack-china.org/guides/code-splitting/)。

对新语法不熟悉的同学请参阅：
* es6: [阮一峰es6入门](http://es6.ruanyifeng.com/)
* cssnext: [postcss官网](http://postcss.org/)
* vue: [vue中文官网](https://cn.vuejs.org/)

## 使用

``` shell
git clone https://github.com/Mrminfive/vue-multiple-page.git
cd vue-multiple-page
npm install
npm run dev
```

## 打包

项目默认配置三种代码环境，分别为 `production(正式环境)`、`production-d(测试环境)` 以及 `development(开发)`。

测试环境与正式环境打包方式一致，主要用于正式版与测试版的代码微调。开发版本相对简单，取消代码压缩及其它不必要的优化，支持开发热更新。

脚手架使用 [DllPlugin + DllReferencePlugin](https://doc.webpack-china.org/plugins/dll-plugin/) 打包外部资源包，优化打包速度，`manifest` 及打包后的文件包均放置在 `static/libs/js` 目录下，也可进入脚本自行配置路径。

### dev

``` shell
npm run dev
```

### build

``` shell
npm run build
```

### build:d

``` shell
npm run build:d
```

### dll(打包外部资源库)

```  
npm run build:vendors
```

> 如果需要打包外部资源库，应先跑 `build:vendors` 命令进行打包外部资源包，再执行编译。

## 项目结构

```
.
├── README.md
├── build
│   ├── build-d.js
│   ├── build.js
│   ├── dev-client.js
│   ├── dev.js
│   ├── util.js
│   ├── webpack.base.config.js
│   ├── webpack.dev.config.js
│   ├── webpack.dll.config.js
│   └── webpack.prod.config.js
├── config
│   ├── base.js
│   ├── dev.env.js
│   ├── index.js
│   ├── prod-d.env.js
│   ├── prod.env.js
│   └── util.js
├── package-lock.json
├── package.json
└── src
    ├── pages
    │   ├── common
    │   │   └── js
    │   │       └── common.js
    │   ├── index (页面1，单页模式将默认将index文件夹作为页面)
    │   │   ├── index.html
    │   │   ├── js
    │   │   │   ├── index.js
    │   │   └── style
    │   └── page2 (页面2)
    │       ├── index.html
    │       ├── js
    │       │   └── index.js
    │       └── style
    └── static (静态资源文件夹)
        ├── libs
        │   └── js (js文件夹下的)
        │       ├── manifest_vendors.json
        │       └── vendors.js
        └── test.txt
```

> *注意*: 开启多页功能的情况下，脚本默认获取 `src/pages`文件夹下除 `common` 文件夹外的所有满足 `!(_)*/!(_)*.html` 条件的html文件作为html页面，并将满足条件的文件夹下的 `js` 文件夹下的 `index.js` 作为 webpack 打包入口。

### 每个页面项目的基本格式

```
.my-page (页面名称)
├── index.html (页面渲染的html模版)
├── js
│   └── index.js (页面脚本入口)
└── style (页面的样式文件)
```

### 编译后的项目结构

```
.
├── css
│   ├── index.3f05035e.css
│   ├── index.3f05035e.css.map
│   ├── page2.3f05035e.css
│   └── page2.3f05035e.css.map
├── js
│   ├── index.3f05035ea26e8a6c3eb8.js
│   ├── index.3f05035ea26e8a6c3eb8.js.gz
│   ├── index.3f05035ea26e8a6c3eb8.js.map
│   ├── page2.3f05035ea26e8a6c3eb8.js
│   └── page2.3f05035ea26e8a6c3eb8.js.map
├── static ()
│   ├── libs
│   │   └── js
│   │       ├── manifest_vendors.json
│   │       └── vendors.js
│   └── test.txt
├── index.html
└── page2.html
```


## 配置

脚手架的基本配置为 `config/base.js` 文件。修改配置文件将影响打包效果。

### 默认配置项

``` js
{
    isMultiplePage: true,
    // 是否启用异步加载功能
    isOpenSyncImport: true,
    // 最小chunk的大小
    minChunkSize: 10000,
    // dev模式下是否自动打开页面
    autoOpenBrowser: true,
    // 文件目录
    assetsRoot: path.resolve(__dirname, '../src'),
    // 生成目录
    buildRoot: path.resolve(__dirname, '../dist'),
    // 静态资源根目录
    staticAssets: 'static',
    // 生成路径
    publicPath: '/',
    // 公用别名
    commonAlias: {
        Static: 'static',
        '@': 'pages'
    },
    // 外部扩展
    externals: {
        // '$': 'JQuery'
    },
    // 公众模块(默认情况下common／js文件下的文件作为`commons chunk`打包)
    commons: {
        // demo: path.resolve(__dirname, '../src/pages/index/js/demo.js')
    },
    // 要打包的外部资源库
    library: [
        'axios',
        'vue',
        'vue-router'
    ],
    // 要引进外部资源库的页面(为空则全部引入)
    libraryEntry: [
        // 'index',
        // 'page2'
    ],
    // 本地开发端口
    port: 8009,
    // 本地开发代理
    proxy: {
        // '/api': {
        //  target: "http://*.com",
        //  changeOrigin: true,
        //  pathRewrite: {
        //      '^/api': ''
        //  },
        //  logLevel: 'error'
        // }
    }
}
```

* `isMultiplePage` <Boolean> 是否多入口打包
* `isOpenSyncImport` <Boolean> 是否启用异步加载功能（启用的状态下，`commons` 参数将失效）
* `minChunkSize` <Number> 最小chunk的大小 (`isOpenSyncImport` 参数为 `true` 是生效)
* `autoOpenBrowser` <Boolean> dev模式下是否自动打开页面
* `assetsRoot` <String> 资源文件目录 URL（参照webpack官方文档）
* `buildRoot` <String> 打包后的文件目录 URL（参照webpack官方文档）
* `staticAssets` <String> 在资源文件目录下的静态资源目录
* `publicPath` <String> 打包后的文件目录对应的公开 URL（参照webpack官方文档）
* `commonAlias` <Object> 公用别名（参照webpack官方文档）
* `externals` <Object> 外部扩展（参照webpack官方文档）
* `commons` <Object> 公众模块（默认情况下common／js文件下的文件作为`commons chunk`打包，在 `isOpenSyncImport` 参数启用的情况下将失效）
* `library` <Array> 要打包的外部资源库（填写模块名或引用路径）
* `libraryEntry` <Array> 要引进外部资源库的页面(为空则全部引入，填写页面名称，即入口文件夹名称)
* `port` <Number> 本地开发端口（默认为 `8009`）
* `proxy` <Object> 本地代理（参照[http-proxy-middleware文档](https://github.com/chimurai/http-proxy-middleware)）

## 备注

*如果遇到脚本语法兼容问题，请升级 `node` 版本。其它问题请[提交问题(issue)](https://github.com/Mrminfive/vue-multiple-page/issues/new)*