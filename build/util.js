/**
 * @description util工具集
 * @author minfive
 * @date 2017-07-17, 11:29:04 GMTCST
 * @lastModify minfive
 * @lastDate 2017-07-17, 11:29:04 GMTCST
 */

const
	path = require('path'),
	chalk = require('chalk'),
	webpack = require('webpack');

const config = require('../config');

function webpackCompile(config, before, after, stdout = true) {
	return webpack(config, (err, stats) => {
		if (err) throw err;

		before && before();

		if (stdout) {
			process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			}) + '\n\n');
			console.log(chalk.cyan('Build complete.\n'));
		}

		process.nextTick(() => after && after());
	});
}

function nowConfig() {
	return process.env.NODE_ENV === 'production'
		? config.build
		: config.dev;
}

function commonsChunkName() {
	let config = nowConfig();

	return config.isOpenSyncImport 
		? []
		: Object.keys(config.commons).concat('common');
}

function pathJoin(...args) {
	return path.posix.join(...args);
}

module.exports = {
	webpackCompile,
	nowConfig,
	commonsChunkName,
	pathJoin
}