/**
 * 日志
 * @authors chandre (chandre21cn@gmail.com)
 * @date    2017-02-15 19:10:49
 * @version $Id$
 */

var log4js 			= require('log4js');
var mkdirp 			= require('mkdirp');
var config 			= require('../config');

mkdirp( config.log_path ) ;
log4js.configure({
	"appenders": [
		{
			"type": 'console',
		},
		{
			type: 'dateFile', //文件输出
			absolute: true,
			filename: config.log_path + '/access.log', 
			pattern: "-yyyy-MM-dd",
			maxLogSize: 1024 * 1024,
			backups : 5,
			category: 'image_service',
			alwaysIncludePattern : true,
		}
	],
	replaceConsole: true,   //替换console.log
});

module.exports = log4js.getLogger("image_service");
