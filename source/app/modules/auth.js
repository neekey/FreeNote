/**
 * 权限，登陆，登出等
 */
var Msh = require( './mongoSessionHandle' ),
	Mh = require( './mongoHandle' ),
	Sh = require( './sessionHandle' ),
    Ch = require( './cookieHandle' ),
    errorConf = _freenote_cfg.error;

var USERNAME = '_freenote_name',
	SERIAL = '_freenote_serial',
	TOKEN = '_freenote_token';

var auth = {

    /**
     * login
     * @param req
     * @param res
     * @param name
     * @param password
     * @param next( err, { serial: serial, token: token } )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found | already_login | password_incorrect
     */
	login: function( req, res, name, password, next ){

        this.check( req, res, function( err, result ){
            if( err ){
                next( err );
            }
            else {

                if( result ){
                    next({
                        type: 'already_login',
                        msg: errorConf.get( 'already_login', { name: name } )
                    });
                }
                else {
                    Mh.getUser( name, function( err, user ){
                        if( err ){
                            next( err );
                        }
                        else {
                            if( user.password === password ){

                                Sh.addSerial( name, function( err, s ){

                                    var newCookie = {};
                                    newCookie[ USERNAME ] = name;
                                    newCookie[ SERIAL ] = s.serial;
                                    newCookie[ TOKEN ] = s.token;

                                    Ch.set( res, newCookie );

                                    next( null, s );
                                });
                            }
                            else {
                                next( {
                                    type: 'password_incorrect',
                                    msg: errorConf.get( 'password_incorrect' )
                                });
                            }
                        }
                    });
                }
            }
        });

	},

    /**
     * check if user has login and update token
     * @param req
     * @param res
     * @param next( err, result )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found
     */
	check: function( req, res, next ){
		var name = req.cookies[ USERNAME ],
			serial = req.cookies[ SERIAL ],
			token = req.cookies[ TOKEN ],
			that = this;

		if( !name || !serial || !token ){
			next( null, false );
		}
		else {
			Sh.getSession( name, function( err, se ){
				if( err ){
					next( err );
				}
				else {
					if( se && se[ serial ] && se[ serial ].token  === token ){
						// 更新token
						that.updateSession( req, res, name, serial, function(){
                            if( err ){
                                next( err, false );
                            }
                            else {
                                next( null, true );
                            }
                        });
					}
					else if( se && se[ serial ] && se[ serial ].token !== token ){

                        // 有安全问题，销毁用户该登陆序列
                        Sh.destroy( name, serial, function( err ){
                            if( err ){
                                next( err );
                            }
                            else {
                                next({
                                    type: 'unsafe_cookie',
                                    msg: errorConf.get( 'unsafe_cookie' )
                                });
                            }
                        });
					}
                    else {
                        next( null, false );
                    }
				}
			});
		}
	},


    /**
     * logout | logout require you login first
     * @param req
     * @param res
     * @param next( err )
     *      err: logout_fail | session_not_found | mongo_error | user_not_exist | serial_not_found
     */
	logout: function( req, res, next ){

        this.check( req, res, function( err, result ){
            if( err ){
                next( err );
            }
            else {
                var name = req.cookies[ USERNAME ],
			        serial = req.cookies[ SERIAL ];

                if( result ){
                    Ch.clear( res, [ USERNAME, SERIAL, TOKEN ] );
                    Sh.destroy( name, serial, function( err ){
                        if( err ){
                            next( err );
                        }
                        else {
                            next( null );
                        }
                    })
                }
                else {
                    next( {
                        type: 'logout_fail',
                        msg: errorConf.get( 'logout_fail' )
                    });
                }
            }
        });
	},

    /**
     * update session[ serial ]
     * @param req
     * @param res
     * @param name
     * @param serial
     * @param next( err )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found
     */
	updateSession: function( req, res, name, serial, next ){
		Sh.updateSession( name, serial, function( err, s ){
            if( err ){
                next( err );
            }
            else {
                var newCookie = {};
                    newCookie[ TOKEN ] = s.token;

                Ch.set( res, newCookie );
                next( null );
            }
        });
	}
};

module.exports = auth;
