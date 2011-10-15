var router = require( './appRouter' ),
	ajaxCheck = require( './ajaxCheck' ),
	Mh = require( './mongoHandle' ),
	auth = require( './auth' ),
	Emit = require( 'events' ).EventEmitter,
    errorConf = _freenote_cfg.error;

var handle = new Emit;

_.extend( handle, {
	
	init: function( app ){
		
		var evt, that = this;

		// 初始化路由		
		router.init( app );

		// 添加每个请求的处理 
		for( evt in this._router ){
			router.on( evt, ( function( e ){

				return function( req, res ){
                    that.preHandle( req, res, e, function(){
                        that._router[ e ].call( that, req, res );
                    });
				};
			})( evt ));
		}

        // Listen to '_error'
        this.on( '_error', function(){
           that.errorHandle.apply( that, arguments );
        });

	},

	_router: {

        /**
         * user login
         * @param req
         * @param res
         */
		'login': function( req, res ){

			var that = this,
                data = req.body,
                name = data.name,
                password = data.password;

			auth.login( req, res, name, password, function( err, s ){
				if( err ){
					that.emit( '_error', req, res, err );
				}
				else {
					res.send({ result: true });
				}
			});
		},

        /**
         * user logout
         * @param req
         * @param res
         */
		'logout': function( req, res ){

			var that = this;
			auth.logout( req, res, function( err ){
				if( err ){
					that.emit( '_error', req, res, err );
				}
				else  {
					res.send({ result: true });
				}
			});
		},

		'register': function( req, res, data ){

			var that = this,
                data = req.body,
                name = data.name,
                password = data.password;

			auth.register( req, res, name, password, function( err, user ){
                if( err ){
                    that.emit( '_error', req, res, err );
                }
                else {
                    res.send( { id: user._id } );
                }
            })
		}
	},

    /**
     * rehandle all the request
     * @param req
     * @param res
     * @param type
     * @param next()
     */
	preHandle: function( req, res, type, next ){
		if( !ajaxCheck.check( req ) ){
			this.emit( '_error', req, res, {
                type: 'not_ajax',
                msg: errorConf.get( 'not_ajax' )
            });
		}
		else {
            if( type === 'login' || type === 'logout' || 'register' ){
                next();
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
                            next();
                        }
                        else {
                            that.emit( '_error', req, res, {
                                type: 'not_login',
                                msg: errorConf.get( 'not_login' )
                            });
                        }
                    }
                });
            }

		}
	},

    /**
     * error handle
     * @param req
     * @param res
     * @param err
     */
    errorHandle: function( req, res, err ){
        res.send( 404, err );
    }
	
});

module.exports = handle;
