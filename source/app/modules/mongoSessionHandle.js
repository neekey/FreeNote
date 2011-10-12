/** 
 * session 处理
 */

var Mgo = require( './mongoModel' ),
	Muser = Mgo.model( 'user' );

var handle = {
 	
	/**
	 * 根据用户名获取session信息
	 */
	get: function( name, next ){
		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next( err );
			}
			else {
				if( !user ){
					next({
						type: 'name',
						msg: '用户名: ' + name + ' 不存在'
					});
				}
				else {
					next( null, user.sessions );
				}
			}
		});
	},

	/**
	 * 更新session
	 */
	update: function( name, session, next ){
		

		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next( err );
			}
			else {
				if( !user ){
					next( {
						type: 'update',
						msg: '不存在用户：' + name
					});
				}
				else {

					var news = {}, olds = {}, 
						keys = _.keys( session ), i, hasNew = false;
					
					for( i = 0; keys[ i ]; i++ ){
						if( keys[ i ] in user.sessions ){
							olds[ keys[ i ] ] = session[ keys[ i ] ];
						}
						else {
							news[ keys[ i ] ] = session[ keys[ i ] ];
							hasNew = true;
						}
					}

					// 先修改已经有的
					user.updateSession( olds );
					user.save( function( err ){
						if( err ){
							next( err );
						}
                        else {
                            // 若又新的数据，则添加
                            if( hasNew ){
                                user.updateSession( news );
                                user.save( next );
                            }
                        }
					});
				}
			}
		});
	},

	/**
	 * 删除session
	 */
	del: function( name, serial, next ){
		Muser.findOne( { name: name }, function( err, user ){
				
			if( err ){
				next( err );
			}
			else {
				if( !user ){
					next( {
						type: 'del',
						msg: '不存在用户：' + name
					});
				}
				else{
					user.delSession( serial );
					user.save( next );
				}
			}
		});
	},

	/**
	 * 删除所有的session
	 */
	delAll: function( name, next ){
		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next( err );
			}
			else {
				if( !user ){
					next( {
						type: 'delAll',
						msg: '不存在用户：' + name
					});
				}
				else {
					user.delAllSession();
					user.save( next );
				}
			}
		});
	}
};


module.exports = handle;
