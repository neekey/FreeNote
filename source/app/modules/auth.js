/**
 * 权限，登陆，登出等
 */
var Msh = require( './mongoSessionHandle' ),
	Mh = require( './mongoHandle' ),
	Sh = require( './sessionHandle' );

var USERNAME = '_freenote_name',
	SERIAL = '_freenote_serial',
	TOKEN = '_freenote_token';

var auth = {
	
	login: function( req, res, username, password, next ){

		Mh.getUser( username, function( err, user ){
			if( err ){
				next( err );
			}
			else {
				if( user.password === password ){
					Sh.addSerial( username, function( err, s ){
                        res.cookie( USERNAME, username, { path: '/' });
                        res.cookie( SERIAL, s.serial, { path: '/' } );
                        res.cookie( TOKEN, s.token, { path: '/' } );

                        next();
                    });

				}
				else {
					next( {
						type: 'login',
						msg: '密码错误'
					});
				}
			}
		});
	},

	/**
	 * 验证用户是否登陆
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
			Sh.getSession( name, serial, function( err, se ){
				if( err ){
					next( err );
				}
				else {
					if( se && se.token  === token ){
						// 更新token
						that.updateToken( req, res, name, serial );
						next( null, true );
					}
					else {
						next( null, false );
					}
				}
			});
		}
	},

	logout: function( req, res, next ){
		var name = req.cookies[ USERNAME ],
			serial = req.cookies[ SERIAL ],
			token = req.cookies[ TOKEN ];
		
		res.clearCookie( USERNAME, { path: '/' } );
		res.clearCookie( SERIAL, { path: '/' } );
		res.clearCookie( TOKEN, { path: '/' } );

		// 销毁session数据
		Sh.destroy( name, serial, next );
	},

	updateToken: function( req, res, name, serial ){
		var token = Sh.updateToken( name, serial );
		res.cookie( TOKEN, token, { path: '/' } );
	}
};

module.exports = auth;
