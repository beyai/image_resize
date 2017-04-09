var _ 				= require("underscore");
_.str 				= require('underscore.string');
_.mixin(_.str.exports());

var waterline 		= require('waterline');
var Waterline 		= new waterline();

// 数据库配置
var config 		= require("../config/db");

// 集合
var collection = [ 
	require("./image"), //图片信息
];

// 加载集合
collection.forEach(function(item){
	Waterline.loadCollection( item );
})

/**
 * 创建全局数据ORM
 * 全局使用方法：Models.表名 表名要首字母大写
 * @return Promise异步操作
 */
module.exports = function(){
	return new Promise( function(resolve , reject){
		Waterline.initialize( config , function( err , ontology ){
			if (err) {
		        return reject(err);
		    };

		    global.Models = {};

		    // 定义全局模型
		    _( Waterline.collections).each(function( Model , key ){
		    	global.Models[ _(key).capitalize() ] = Model;
		    });

		    resolve("Waterline initialize done");
		});
	})
}

