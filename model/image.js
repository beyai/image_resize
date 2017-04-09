/**
 * 图片
 * @type {Object}
 */
var _ 				= require("underscore");
var Waterline 		= require('waterline');

module.exports = Waterline.Collection.extend({
	schema: true,
	migrate : "safe",
    identity: 'image',
    connection: 'mongodb',
    autoCreatedAt : false,
	autoUpdatedAt : false,
    attributes: {
		id : { //id
			type     : "String",
			primaryKey: true,
			unique   : true
		},

	    path : {  //内容
	    	type: "String",
			required : true
	    }, 	

	    type 	: { //图片对象集合
	    	type: "String",
	    	defaultsTo : "jpg"
	    }, 	

	    width: {  //宽
	    	type: "integer",
	    	defaultsTo : 0
	    } ,

	    height: {  //高
	    	type: "integer",
	    	defaultsTo : 0
	    } , 

	    size 	: { //文件大小
	    	type: "integer",
	    	defaultsTo : 0
	    }, 

	    datetime : {
			type : "integer",
			defaultsTo : function(){
				return _.now();
			}
		}
	}
});