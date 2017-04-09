/**
 * 图片处理
 * @authors chandre (chandre21cn@gmail.com)
 * @date    2017-03-12 20:04:47
 * @version $Id$
 */

var _           = require("underscore");
var worker      = require('load-process-manager').worker;
var mkdirp 		= require("mkdirp");
var sharp 		= require("sharp");
var fs 			= require("fs");
var path 		= require("path");
var models 		= require("./model");
var config 		= require("./config/");

var imageService = function(){

};

imageService.prototype = {

	// 开始处理图片
	start : function( options , callback ){

		var self = this,
			cachePathName = [ options.w , options.h , options.t , options.c ].join("_"), //缓存目录名 类型_宽_高
			fileName = [ options.id , options.t ].join("."),  //文件名
			cachePath = path.join( config.image_cache , cachePathName , fileName );

		// 查找文件是否存在
		self.findCache( cachePath ).then(function( imgPath ) {
			if ( callback ) callback( null , imgPath ); //图片存在直接返回
		}).catch(function(){

			// 图片不存在则从数据库中读取信息
			Models.Image.findOne( { "id" : options.id } ).then( function( ret ) {

				let opts = _.extend( ret , {
					width : options.w,
					height : options.h,
					cacheDir : cachePathName,
					crop 	: self.crop(options.c), //裁剪位置
				});

				// 缩放图片
				return self.resize(opts);
			}).then(function( filePath ){
				if ( callback ) callback( null , filePath );
			}).catch(function(err){
				if ( callback ) callback(err);
			})

		});
	},

	//查找本地图片
	findCache : function( imgPath ){
		return new Promise(function ( resolve , reject ) {
			try{
				fs.exists( imgPath , function(exists){
					if(exists){
			        	resolve( imgPath );
			        } else {
			        	reject( exists );
			        }
				})
			} catch(err) {
			    reject( err );
			}
		})
	},

	// 缩放图片
	resize : function( options ){
		var self = this;

		return new Promise(function ( resolve , reject ) {

			if ( !_.has( options , "path" ) ) return reject("Image Is Not Find");

			let oldPath = path.join( config.image_save_path , options.path ),
				w = _.isNaN( parseInt(options.width) ) ? null : parseInt(options.width),
				h = _.isNaN( parseInt(options.height) ) ? null : parseInt(options.height);

			// 如果不包含图片宽高，直接返回原图
			if ( !_.isNumber(w) && !_.isNumber(h) ) return resolve(oldPath);

			// 创建存放目录
			self.mkdir( options.cacheDir ).then( function( dirName ) {
				// 新图片地址
				let newPath = path.join( dirName , [options.id , options.type].join(".") );

				// 缩放
				sharp( oldPath )
					// 缩略图类型
					.jpeg()
					// 缩放大小
					.resize( w , h )
					// 图片裁剪位置
					.crop( options.crop )
					// 缓存文件
					.toFile( newPath , function(err , info){
						if (err) return reject(err);
						resolve(newPath);
					})
					.on("error",function(err){
						reject(err);
					});

			}).catch(function(err){
				reject(err);
			})
			
		});
	},

	// 图片裁剪位置
	crop : function( gravity ){
		var val = "centre";
		gravity = gravity ? gravity.toLowerCase() : "c";
		switch ( gravity ) {
			case "n" : 
				val = "north";
				break;
			case "ne":
				val = "northeast";
				break;
			case "e":
				val = "east";
				break;
			case "se":
				val = "southeast";
				break;
			case "s":
				val = "south";
				break;
			case "sw":
				val = "southwest";
				break;
			case "w":
				val = "west";
				break;
			case "nw":
				val = "northwest";
				break;
			case "c":
				val = "center";
				break;
			default : 
				val = "centre";
		}

		return val;
	},
	
	// 创建缓存目录
	mkdir : function( dirName ){
		return new Promise(function ( resolve , reject ) {
			// 用时间生成目录
			var filePath = path.join( config.image_cache , dirName );
			mkdirp( filePath ,function(err){
				if (err) {
					reject("图片目录创建失败 " + filePath )
				} else {
					resolve( filePath )
				}
			});
		})
	}


}

var ImagesService = new imageService();

// 初始化数据模型
models().then(function( info ){
	worker.ready();
	// 接收主进程请求
	worker.on('request', function (req) {
		ImagesService.start( req.data , function( err , file ){
			if (err) return req.respond({
				status : false,
				msg : err
			});
			req.respond({
				status : true,
				msg : file
			});
		});
	});
	// 实例化工作进程
}).catch(function(err){
	console.log(err)
});