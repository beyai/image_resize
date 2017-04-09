/**
 * 数据库连接配置
 * @authors chandre (chandre21cn@gmail.com)
 * @date    2017-02-15 19:10:49
 * @version $Id$
 */

var mongoAdapter 	= require('sails-mongo');

module.exports = {
	adapters: {
        'mongodb'	: mongoAdapter,
    },

	connections : {
		mongodb: {
            adapter: 'mongodb',
            host: 'localhost',
		    port: 27017,
		    database: 'information',
		    poolSize : 10
        }
	}
}