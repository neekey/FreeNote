/**
 * 权限，登陆，登出等
 */
var Msh = require( './mongoSessionHandle' ),
    Mh = require( './mongoUserHandle' ),
    Sh = require( './sessionHandle' ),
    SyncH = require( './syncHandle' ),
    Ch = require( './cookieHandle' ),
    errorConf = _freenote_cfg.error,
    cookieConfig = _freenote_cfg.cookie;

var USERNAME = cookieConfig.username,
    SERIAL = cookieConfig.serial,
    TOKEN = cookieConfig.token;

var auth = {

    /**
     * register
     * @param req
     * @param res
     * @param name
     * @param password
     * @param next( err, user )
     *      err: session_not_found | mongo_error | user_not_exist | serial_not_found | already_login
     */
    register: function( req, res, name, password, next ){

        var that = this;

        this.check( req, res, function( err, result, _name ){
            if( err ){
                next( err );
            }
            else {

                if( result ){
                    next({
                        type: 'already_login',
                        msg: errorConf.get( 'already_login', { name: _name } )
                    });
                }
                else {
                    Mh.getUser( name, function( err, user ){
                        if( err ){
                            if( err.type === 'user_not_exist' ){
                                Mh.addUser( name, password, function( err, user ){
                                    if( err ){
                                        next( err );
                                    }
                                    else {

                                        /*
                                        Sh.addSerial( name, function( err, s ){

                                            var newCookie = {};
                                            newCookie[ USERNAME ] = name;
                                            newCookie[ SERIAL ] = s.serial;
                                            newCookie[ TOKEN ] = s.token;

                                            Ch.set( res, newCookie );

                                            next( null, user );
                                        });
                                        */

                                        // 登陆
                                        that.login( req, res, name, password, function( err, s ){

                                            if( err ){

                                                next( err );
                                            }
                                            else {

                                                next( null, user );
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                next( err );
                            }
                        }
                        else {
                            next({
                                type: 'user_already_exist',
                                msg: errorConf.get( 'user_already_exist', { name: name } )
                            })
                        }
                    });
                }
            }
        });
    },
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

        this.check( req, res, function( err, result, _name ){
            if( err ){
                next( err );
            }
            else {

                if( result ){
                    next({
                        type: 'already_login',
                        msg: errorConf.get( 'already_login', { name: _name } )
                    });
                }
                else {
                    Mh.getUser( name, function( err, user ){
                        if( err ){
                            next( err );
                        }
                        else {
                            if( user.password === password ){

                                // 添加一个登陆序列
                                Sh.addSerial( name, function( err, s ){

                                    var newCookie = {};
                                    newCookie[ USERNAME ] = name;
                                    newCookie[ SERIAL ] = s.serial;
                                    newCookie[ TOKEN ] = s.token;

                                    Ch.set( res, newCookie );

                                    // 添加一个同步列表
                                    SyncH.add( name, s.serial, function( err, sync ){

                                        if( err ){

                                            next( err );
                                        }
                                        else {

                                            next( null, user );
                                        }
                                    });
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

        if( !name || !serial ){
            next( null, false );
        }
        else {
            Sh.getSession( name, function( err, se ){
                if( err ){
                    if( err.type === 'mongo_error' ){
                        next( err );
                    }
                    else {
                        next( null, false );
                    }
                }
                else {
                    if( se && se[ serial ] && se[ serial ].token  === token ){
                        // 更新token
                        that.updateSession( req, res, name, serial, function(){
                            if( err ){
                                next( err, false );
                            }
                            else {
                                next( null, true, name );
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
                                // delete cookie
                                Ch.clear( res, [ USERNAME, SERIAL, TOKEN ] );

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

                            // 删除该同步列表
                            SyncH.destroy( name, serial, function( err ){

                                if( err ){

                                    next( err );
                                }
                                else {

                                    next( null );
                                }
                            });
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
