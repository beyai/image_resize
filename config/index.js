/**
 * 客户端配置
 * @authors chandre (chandre21cn@gmail.com)
 * @date    2017-02-15 19:10:49
 * @version $Id$
 */

module.exports = {
	// 工作进程
	worker_num : 5,
	// 图片文件存储目录
	image_save_path : "/data/images/",
	// 图片缓存目录
	image_cache : "/data/cache/",
	// 日志目录
	log_path : __dirname + "/../logs/",
	// 服务端口
	port : 2000
}