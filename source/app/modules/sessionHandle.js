/**
 * 内存中的session信息
 */
var Msh = require( './mongoSessionHandle' ),
    syH = require( './syncHandle' ),
    crypto = require('crypto'),
    errorConf = _freenote_cfg.error;

// 过期时间（查过这个时间session将从内存中销毁）
Expire = 30,

// session 数据在内存中的保存
session = {},

// 用于标识每个用户，出现内存中的session数据少于数据库中的session数据的情况
sessionSyn = {},

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

        this.updateTimer( name, serial );
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

        // add to memory
        session[ name ][ serial ] = { token: null };

		// 更新
		this.updateSession( name, serial, function( err, s ){
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
     * @param next( err, s )
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

                    s = session[ name ][ serial ];

                    s.token = that.newToken( name, serial );
                    // remember S from getSession is not the session[ serial ] from memory
                    that.updateTimer( name, serial );

                    next( null, s );
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
                    s = session[ name ][ serial ];

                    s.token = that.newToken( name, serial );
                    next( null, s );
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
                    that.updateTimer( name, serial );

                    next( null, session[ name ][ serial ] );
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
     * 更新session的active时间，并设置过期回调
     * !!! 该方法作为私有方法，应该在确保name和serial指定的session数据存在的时候被调用
     * @param name
     * @param serial
     */
    updateTimer: function( name, serial ){
        var that = this;

        var s = session[ name ][ serial ];

        s.active = Date.now();

        // clear timer
        s.clearTimer && s.clearTimer();

        // set timeout
        var timer = setTimeout( function(){
            // save session to mongodb
            that.save( name, serial, function( err ){
                if( err ){
                    console.log( err );
                }
                else {
                    // delete session from memory
                    that.del( name, serial );
                    console.log( 'user ' + name + '\' session: ' + serial + ' is expried!' );
                }
            });
        }, Expire * 60 * 1000 );

        // reset the clear function
        s.clearTimer = function(){
            clearTimeout( timer );
        };
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
        this.getSession( name, function( err, s ){
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
		var _s = this.getSessionFromMemory( name ),
            that = this;

        if( _s && ( !sessionSyn[ name ] || sessionSyn[ name ].length === 0 ) ){
            next( null, _s );
        }
		else {

            this.getSessionFromDB( name, function( err, s ){
                if( err ){
                    next( err );
                }
                else {
                    // import to memory
                    _.each( s, function( t, _s ){
                       that.importSerial( name, _s, t );
                    });

                    // seset sessionSyn
                    sessionSyn[ name ] = [];
                    
                    // 不能直接返回s，因为内存中原有可能存在数据库中尚没有的数据
                    next( null, session[ name ] );
                }
            })
		}
	},

    /**
     * get session by name from memory
     * @param name
     */
    getSessionFromMemory: function( name ){
        return session[ name ];
    },

    /**
     * get session by name from mongodb
     * @param name
     * @param next( err )
     */
    getSessionFromDB: function( name, next ){
        Msh.get( name, function( err, s ){
            if( err ){
                next( err );
            }
            else {
                next( null, s );
            }
        });
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

            if( !sessionSyn[ name ] ){

                sessionSyn[ name ] = [];
            }
            if( _.indexOf( sessionSyn[ name ], serial ) < 0 ){

                sessionSyn[ name ].push( serial );
            }
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
		Msh.del( name, serial, function( err ){
            if( !err ){
                var index = _.indexOf( sessionSyn[ name ], serial );
                sessionSyn[ name ].splice( index, 1 );
            }

            next( err );
        });
	},

    /**
     * save session[ serial ] from memory to mongodb
     * @param name
     * @param serial
     * @param next( err )
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
