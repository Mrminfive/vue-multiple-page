const
	path = require('path'),
	webpack = require('webpack');

const config = require('../config/base');

const libsPath = path.resolve(__dirname, '../src/static/libs/js');

module.exports = {
	entry: {
		vendors: config.library
	},

	output: {
		path: libsPath,
		filename: '[name].js',
		library: '[name]_library'
	},

	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.DllPlugin({
			path: path.join(libsPath, 'manifest_[name].json'),
			name: '[name]_library',
			context: __dirname
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: true
			}
		})
	]
}