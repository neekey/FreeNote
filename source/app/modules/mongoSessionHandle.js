/** 
 * session 处理
 */

var Mgo = require( './mongoModel' ),
	Muser = Mgo.model( 'user' ),
    errorConf = _freenote_cfg.error;

var handle = {

    /**
     * get user session by name
     * @param name
     * @param next( err, sessions )
     */
	get: function( name, next ){
		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next( {
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                } );
			}
			else {
				if( !user ){
					next({
						type: 'user_not_exist',
						msg: errorConf.get( 'user_not_exist', { name: name })
					});
				}
				else {
					next( null, user.sessions );
				}
			}
		});
	},

    /**
     * update user sessions
     * @param name
     * @param session { serial: token }
     * @param next( err )
     */
	update: function( name, session, next ){
		

		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next( {
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                } );
			}
			else {
				if( !user ){
					next({
						type: 'user_not_exist',
						msg: errorConf.get( 'user_not_exist', { name: name })
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
							next( {
                                type: 'mongo_error',
                                msg: errorConf.get( 'mongo_error', err )
                            } );
						}
                        else {
                            // 若又新的数据，则添加
                            if( hasNew ){
                                user.updateSession( news );
                                user.save( function( err, user ){
                                    if( err ){
                                        next( {
                                            type: 'mongo_error',
                                            msg: errorConf.get( 'mongo_error', err )
                                        } );
                                    }
                                    else {
                                        next( null );
                                    }
                                });
                            }
                            else {
                                next( null );
                            }
                        }
					});
				}
			}
		});
	},

    /**
     * delete user.sessions[ serial ]
     * @param name
     * @param serial
     * @param next( err )
     */
	del: function( name, serial, next ){
		Muser.findOne( { name: name }, function( err, user ){
				
			if( err ){
				next( {
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                } );
			}
			else {
				if( !user ){
					next({
						type: 'user_not_exist',
						msg: errorConf.get( 'user_not_exist', { name: name })
					});
				}
				else{
					user.delSession( serial );
					user.save( function( err ){
                        if( err ){
                            next( {
                                type: 'mongo_error',
                                msg: errorConf.get( 'mongo_error', err )
                            } );
                        }
                        else {
                            next( null );
                        }
                    });
				}
			}
		});
	},

    /**
     * delete all the user's sessions
     * @param name
     * @param next( err )
     */
	delAll: function( name, next ){
		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next( {
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                } );
			}
			else {
				if( !user ){
					next({
						type: 'user_not_exist',
						msg: errorConf.get( 'user_not_exist', { name: name })
					});
				}
				else {
					user.delAllSession();
					user.save( function( err ){
                        if( err ){
                            next( {
                                type: 'mongo_error',
                                msg: errorConf.get( 'mongo_error', err )
                            } );
                        }
                        else {
                            next( null );
                        }
                    });
				}
			}
		});
	}
};

module.exports = handle;
