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
	
	login: function( req, username, password, next ){

		Mh.getUser( username, function( err, user ){
			if( err ){
				next( err );
			}
			else {
				if( user.password === password ){
					var newS = Sh.addSerial( username );
					req.cookie( USERNAME, username ); 
					req.cookie( SERIAL, newS.serial );
					req.cookie( TOKEN, newS.token );

					next();
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
	check: function( req, next ){
		var name = req.cookies[ USERNAME ],
			serial = req.cookies[ SERIAL ],
			token = req.cookies[ TOKEN ],
			that = this;

		Sh.getSession( name, serial, function( err, se ){
			if( err ){
				next( err );
			}
			else {
				if( se.token === token ){
					// 更新token
					that.updateToken( req, name, serial );
					next( null, true );
				}
				else {
					next( null, false );
				}
			}
		});
	},

	logout: function( req, next ){
		var name = req.cookies[ USERNAME ],
			serial = req.cookies[ SERIAL ],
			token = req.cookies[ TOKEN ];
		
		req.clearCookie( USERNAME );
		req.clearCookie( SERIAL );
		req.clearCookie( TOKEN );

		// 销毁session数据
		Sh.del( name, serial );
	},

	updateToken: function( req, name, serial ){
		var token = Sh.updateToken( name, serial );
		req.cookie( TOKEN, token );
	}
};

module.exports = auth;
