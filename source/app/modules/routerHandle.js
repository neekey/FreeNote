var router = require( './appRouter' ),
	ajaxCheck = require( './ajaxCheck' ),
	Mh = require( './mongoHandle' ),
	_ = require( 'underscore' ),
	auth = require( './auth' ),
	Emit = require( 'events' ).EventEmitter;

var handle = new Emit;

_.extend( handle, {
	
	init: function( app ){
		
		var evt, that = this;

		// 初始化路由		
		router.init( app );

		// 每个请求的预处理	
		router.on( 'beforeHandle', function(){
			that.preHandle.apply( that, arguments ); 
		});

		// 添加每个请求的处理 
		for( evt in this._router ){
			router.on( evt, (function( e ){
				return function(){
					that._router[ e ].apply( that, arguments );
				};
			})( evt ));
			
		}

		this.on( '_error', function( req, res, err ){
			console.log( err );
			res.send( 201, err );
		});
	},

	_router: {
		'userLogin': function( req, res, data ){
			var that = this;
			auth.login( req, res, data.name, data.password, function( err ){
				if( err ){
					that.emit( '_error', req, res );
				}
				else {
					res.send({ msg: 'login success' });
				}
			});
		},

		'userLogout': function( req, res ){
			var that = this;
			auth.logout( req, res, function( err ){
				if( err ){
					that.emit( '_error', req, res );
				}
				else  {
					res.send({ msg: 'logout success' });
				}
			});
		},

		'addUser': function( req, res, data ){
			var that = this;

			Mh.getUser( data.name, function( err, user ){
				if( err ){
					that.emit( '_error', req, res, err );	
				}
				else {
					if( user ){
						that.emit( '_error', req, res, {
							type: 'addUser',
							msg: '用户名：' + data.name + ' 已经存在'
						});
					}
					else {
						Mh.addUser( data.name, data.password, function( err, user ){
							if( err ){
								that.emit( '_error', req, res, err );
							}
							else {
								auth.login( req, res, data.name, data.password, function( err ){
									if( err ){
										that.emit( '_error', req, res, err );
									}
									else {
										res.send({ id: user._id });
									}
								});
							}
						});
					}
				}
			});
		}
	},

	preHandle: function( req, res, next ){
		if( !ajaxCheck.check( req ) ){
			next( false );
		}
		else {
			var that = this;
			// auth check
			auth.check( req, res, function( err, result ){
				if( err ){
					that.emit( '_error', req, res, err );
				}
				else {
					if( result ){
						next( true );
					}
					else {
						next( false );
					}
				}
			});
		}
	}
	
});

module.exports = handle;
