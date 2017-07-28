const
    path = require('path')
    webpack = require('webpack')
    Glob = require('glob').Glob;

const 
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const { nowConfig } = require('./util');

const config = nowConfig();

function getPath(...args) {
    return path.join(config.assetsRoot, ...args);
}

function getCommonsChunk() {
    return new Glob('!(_)*/!(_)*.js', {
        cwd: getPath('pages', 'common'),
        sync: true
    })
        .found
        .map(file => getPath('pages', 'common', file));
}

const commonsChunk = config.isOpenSyncImport ? {} : Object.assign({
    common: getCommonsChunk()
}, config.commons);

function getCommonsChunkPluginSetting() {
    return config.isOpenSyncImport 
        ? config.minChunkSize 
            ? [ 
                // 设置chunk的最小大小
                new webpack.optimize.MinChunkSizePlugin({
                    minChunkSize: config.minChunkSize || 10000
                }) 
            ]
            : []
        : [
            // 公用模块抽离
            new webpack.optimize.CommonsChunkPlugin({
                names: ['manifest'].concat(Object.keys(commonsChunk)),
                minChunk: function(module) {
                    return module.context && module.context.index('node_modules') !== -1;
                }
            })
        ]
}

module.exports = {
    entry: Object.assign({}, config.entry, commonsChunk),

    output: {
        path: config.buildRoot,
        filename: path.join('js', '[name].[hash].js'),
        chunkFilename: path.join('js', '[name].[hash].js'),
        publicPath: config.publicPath
    },

    resolve: {
        extensions: ['.js', '.vue', '.json', '.css'],
        alias: config.commonAlias
    },

    externals: config.externals,

    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                fallback: 'vue-style-loader',
                                use: 'css-loader'
                            })
                        }
                    }
                }
            },
            {
                test: /\.js$/,
                include: [
                    config.assetsRoot,
                    path.resolve(__dirname, '..', 'text')
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader'
                        ]
                    })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: path.join(config.staticAssets, 'images/[name].[hash:8].[ext]')
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: path.join(config.staticAssets, 'fonts/[name].[hash:8].[ext]')
                    }
                }
            }
        ]
    },

    plugins: [
        // 提取css
        new ExtractTextPlugin({
            filename: path.join('css', '[name].[hash:8].css')
        }),

        // 检测外部依赖包是否更新
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(`${config.assetsRoot}/${config.staticAssets}/libs/js/manifest_vendors.json`)
        }),

        // 插入自定义文件插入到html中
        new AddAssetHtmlPlugin([
            {
                filepath: path.join(config.assetsRoot, config.staticAssets, 'libs/js/vendors.js'),
                publicPath: path.join(config.publicPath, config.staticAssets, 'libs/js'),
                outputPath: path.join(config.staticAssets, 'libs/js'),
                files: config.libraryEntry.map(entry => entry + '.html'),
                includeSourcemap: false
            }
        ])
    ].concat(getCommonsChunkPluginSetting())
}