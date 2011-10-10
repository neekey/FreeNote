/** 
 * 用于检查发送的请求是否为ajax请求
 */

var checker = function( req ){
	if( req.headers[ 'x-requested-with' ] === "XMLHttpRequest" ){
		return true;
	}
	else {
		return false;
	}
};

exports.check = checker;
