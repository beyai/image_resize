/**
 * 图片访问服务
 * @authors chandre (chandre21cn@gmail.com)
 * @date    2017-01-17 19:15:33
 * @version $Id$
 */

var _           = require("underscore");
var Manager     = require('load-process-manager').supervisor;
var express 	= require('express');
var fs 			= require("fs");
var config 		= require("./config/");
var logger 		= require("./libs/logger");

var app 		= express();

// 创建数据处理进程
var Master = Manager({
    worker: {
        file: __dirname + '/worker.js',
        count: config.worker_num || 5
    }
});

// 收藏图标
app.get("/favicon.ico", function (req, res) {
	res.send("");
});

// GET method route
app.get("/:id", function (req, res) {
	var opts = _.extend( req.params , req.query );
	// 访问信息
	logger.info(` ${req.method}  ${req.connection.remoteAddress}  ${req.url}`);

	// 子进程处理图片
 	Master.enqueue( opts ).then(function ( ret ) {
 		// 返回文件地址
 		if ( ret.data.status ) {
	        try {
	        	fs.createReadStream( ret.data.msg ).pipe(res);
	        } catch( err ) {
				logger.error(` ${req.method}  ${req.connection.remoteAddress}  ${req.url} ${err}`);
	        	res.send( err );
	        }
 		} else {
			logger.error(` ${req.method}  ${req.connection.remoteAddress}  ${req.url} ${ret.data.msg}`);
	        res.send( ret.data.msg );
 		}
    });
});



// 主进程关闭
Master.on('SIGINT', function () {
    logger.info('主进程关闭！');
    Master.softKill(function () {
        logger.info('等待子进程关闭...');
    })
});

Master.on('online', function () {
	console.log("服务启动成功")
	// 启动HTTP服务
    var server = app.listen({
    	port : config.port || 2000,
    	host : "0.0.0.0"
    }, function () {
		var host = server.address().address;
		var port = server.address().port;
		logger.info('Image Service listening at http://%s:%s', host, port);
	});
});

console.log("服务启动中......")
Master.start();


