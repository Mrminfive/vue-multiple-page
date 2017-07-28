/**
 * @description 开发环境配置
 * @author minfive
 * @date 2017-07-17, 10:40:19 GMTCST
 * @lastModify minfive
 * @lastDate 2017-07-17, 10:40:19 GMTCST
 */

const
	merge = require('webpack-merge'),
	prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"'
});