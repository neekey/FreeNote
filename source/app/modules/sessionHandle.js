/**
 * 内存中的session信息
 */
var Msh = require( './mongoSessionHandle' ),
    crypto = require('crypto'),
    errorConf = _freenote_cfg.error;

// 过期时间（查过这个时间session将从内存中销毁）
Expire = 30,

session = {
},

handle = {

    /**
     * import session[ serial ] to memory
     * @param name
     * @param serial
     * @param token
     */
	importSerial: function( name, serial, token ){
		if( !( name in session ) ){
			session[ name ] = {};
		}
        if( !( serial in session[ name ] )){
            session[ name ][ serial] = {};
        }
		session[ name ][ serial ][ 'token' ] = token;
	},

    /**
     * add new session[ serial ]
     * @param name
     * @param next( err, { serial: newserial, token: newToken } )
     *      session_not_found | mongo_error | user_not_exist | serial_not_found
     */
	addSerial: function( name, next ){

		if( !( name in session ) ){
			session[ name ] = {};
		}

		var serial = this.newSerial( name );

		// 更新
		this.updateSession( name, serial, function( err ){
            if( err ){
                next( err );
            }
            else {
                next( null, {
                    serial: serial,
                    token: s.token
                });
            }
        } );
	},

    /**
     * update session token and active date
     * @param name
     * @param serial
     * @param next( err )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found
     */
    updateSession: function( name, serial, next ){

        var that = this, s;
        this.getSession( name, function( err, S ){
            if( err ){
                next( err );
            }
            else {
                if( S[ serial ] ){

                    // remember S from getSession is not the session[ serial ] from memory
                    s = session[ serial ];

                    s.token = that.newToken( name, serial );
                    s.active = Date.now();
                    clearTimeout( s.timer );

                    // 设置超时
                    s.timer = setTimeout( function(){
                        that.del( name, serial );
                    }, Expire * 60 * 1000 );

                    next( null );
                }
                else {
                    next({
                        type: 'serial_not_found',
                        msg: errorConf.get( 'serial_not_found', { name: name, serial: serial } )
                    });
                }
            }
        });
    },

    /**
     * update session[ serial ] token
     * @param name
     * @param serial
     * @param next( err )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found
     */
	updateToken: function( name, serial, next ){
        var that = this, s;
        this.getSession( name, function( err, S ){
            if( err ){
                next( err );
            }
            else {
                if( S[ serial ] ){

                    // remember S from getSession is not the session[ serial ] from memory
                    s = session[ serial ];

                    s.token = that.newToken( name, serial );
                    next( null );
                }
                else {
                    next({
                        type: 'serial_not_found',
                        msg: errorConf.get( 'serial_not_found', { name: name, serial: serial } )
                    });
                }
            }
        });
	},

    /**
     * update session[ serial ] active date
     * @param name
     * @param serial
     * @param next( err )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found
     */
	updateActive: function( name, serial, next ){
		var that = this, s;
        this.getSession( name, function( err, S ){
            if( err ){
                next( err );
            }
            else {
                if( S[ serial ] ){

                    // remember S from getSession is not the session[ serial ] from memory
                    s = session[ serial ];
                    s.active = Date.now();
                    clearTimeout( s.timer );

                    // set timeout
                    s.timer = setTimeout( function(){
                        that.del( name, serial, function( err ){
                            console.log( err );
                        });
                    }, Expire * 60 * 1000 );
                }
                else {
                    next({
                        type: 'serial_not_found',
                        msg: errorConf.get( 'serial_not_found', { name: name, serial: serial } )
                    });
                }

            }
        });
	},

    /**
     * get token
     * @param name
     * @param serial
     * @param next( err, token )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found
     */
    getToken: function( name, serial, next ){
        var that = this;
        this.getSession( name, serial, function( err, s ){
            if( err ){
                next( err );
            }
            else {
                if( s[ serial ] ){
                    next( null, s[ serial ] );
                }
                else {
                    next({
                        type: 'serial_not_found',
                        msg: errorConf.get( 'serial_not_found', { name: name, serial: serial } )
                    });
                }
            }
        });
        
    },
    /**
     * get session by username, if not in memory, it will check mongdb, which also fetch the data into memory
     * @param name
     * @param next( err, session )
     *      err: session_not_found | mongo_error | user_not_exist
     */
	getSession: function( name, next ){
		var u = session[ name ], that = this;

		if( u ){
			next( null, u );
		}
		else {
			// 从数据库中获取session数据
			Msh.get( name, function( err, user ){
				if( err ){
					next( err );
				}
				else {
                    if( user.sessions && _.isObject( user.sessions )){

                        // import to memory
                        _.each( user.sessions, function( t, s ){
                           that.importSerial( name, s, t );
                        });

                        next( null, user.sessions );
                    }
                    else {
                        next( {
                            type: 'session_not_found',
                            msg: errorConf.get( 'session_not_found', { name: name })
                        });
                    }
				}
			});
		}
	},

    /**
     * delete session[ serial ] from memory
     * @param name
     * @param serial
     */
	del: function( name, serial ){
		var u = session[ name ];

		if( u ){
			delete u[ serial ];
		}
	},

    /**
     * delete session from both memory and mongodb
     * @param name
     * @param serial
     * @param next( err )
     *      err: mongo_error | user_not_exist
     */
	destroy: function( name, serial, next ){

		// 从内存中删除
		this.del( name, serial );

		// 从数据库中删除
		Msh.del( name, serial, next );
	},

    /**
     * save session[ serial ] from memory to mongodb
     * @param name
     * @param serial
     * @param next
     *      err: mongo_error | user_not_exist
     */
	save: function( name, serial, next ){
		
		var u = session[ name ], s, newS;

		if( u ){
			s = u[ serial ];
			
			if( s ){

				newS = {};
                newS[ serial ] = s.token;

				Msh.update( name, newS, next );
			}
			else {
				next( null );
			}
		}
		else {
            next( null );
        }
	},

    /**
     * create an encrypted serial
     * @param name
     * @return {String}
     */
	newSerial: function( name ){
		var curDateStr = ( new Date ).toString(),
			curDate = String( Date.now() );

		var SHA = crypto.createHash( 'sha256' );

		SHA.update( curDateStr + 'freenote' + String( Math.random() ) + name + curDate );
		return SHA.digest();
	},

    /**
     * create an encrypted token
     * @param name
     * @param serial
     * @return {String}
     */
	newToken: function( name, serial ){
		var curDateStr = ( new Date ).toString(),
			curDate = String( Date.now() );

		var SHA = crypto.createHash( 'sha256' );

		SHA.update( curDateStr + 'freenote' + String( Math.random() ) + name + serial + curDate );
		return SHA.digest();
	}
};

module.exports = handle;
