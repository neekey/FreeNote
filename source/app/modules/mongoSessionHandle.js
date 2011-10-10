/** 
 * session 处理
 */

var Mgo = require( './mongoModel' ),
	_ = require( 'underscore' ),
	Muser = Mgo.model( 'user' );

var handle = {
 	
	/**
	 * 根据用户名获取session信息
	 */
	get: function( name, next ){
		Muser.findOne( { name: name }, next );
	},

	/**
	 * 更新session
	 */
	update: function( name, session, next ){
		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				console.log( err );
			}
			else {
				user.updateSession( session, next );
			}
		});
	},

	/**
	 * 删除session
	 */
	del: function( name, serial, next ){
		Muser.findOne( { name: name }, function( err, user ){
				
			if( err ){
				console.log( err );
			}
			else {
				user.delSession( serial, next );
			}
		});
	},

	/**
	 * 删除所有的session
	 */
	delAll: function( name, next ){
		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				console.log( err );
			}
			else {
				user.delAllSession( next );
			}
		});
	}
};


