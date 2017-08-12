/**
 * @description 生产环境webpack配置
 * @author minfive
 * @date 2017-07-17, 14:17:52 GMTCST
 * @lastModify minfive
 * @lastDate 2017-07-17, 14:17:52 GMTCST
 */

const 
	path = require('path'),
	webpack = require('webpack'),
	webpackMerge = require('webpack-merge');

const
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	CompressionWebpackPlugin = require('compression-webpack-plugin'),
	BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
	UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const 
	baseWebpackConfig = require('./webpack.base.config'),
	{ nowConfig, commonsChunkName } = require('./util');

const config = nowConfig();

const commonsChunk = commonsChunkName();

module.exports = webpackMerge(baseWebpackConfig, {
	devtool: config.sourceMap || false,

	plugins: [
		// 环境变量
		new webpack.DefinePlugin({
			'process.env': config.env
		}),

		// banner条
		new webpack.BannerPlugin('版权归友友传媒所有'),

		// 压缩css
		new OptimizeCSSPlugin(),

		// 变量提升
		new webpack.optimize.ModuleConcatenationPlugin(),

		// 压缩代码
		new UglifyJSPlugin({
			compress: {
				warnings: false
			},
			sourceMap: true
		}),

		// 压缩静态资源
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.js$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}),

		// 拷贝静态资源
		new CopyWebpackPlugin([
			{
				from: path.join(config.assetsRoot, config.staticAssets),
				to: path.join(config.buildRoot, config.staticAssets)
			}
		]),

		// bundle分析
		// new BundleAnalyzerPlugin()
	].concat(config.template.map(template => {
		let chunkName = template.split(path.sep).slice(-2)[0];

		return new HtmlWebpackPlugin({
			filename: chunkName + '.html',
			template: template,
			chunks: [chunkName].concat(commonsChunk),
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			},
			showErrors: true,
			chunksSortMode: function(chunk1, chunk2) {
				let
					entrys = Object.keys(config.entry),
					vendors = commonsChunk;

				let 
					orders = ['manifest'].concat(vendors, entrys),
					order1 = orders.indexOf(chunk1.names[0]),
					order2 = orders.indexOf(chunk2.names[0]);

				if (order1 > order2) {
				    return 1;
				} else if (order1 < order2) {
				    return -1;
				} else {
				    return 0;
				}
			}
		});
	}))
});