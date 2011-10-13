/**
 * 内存中的session信息
 */
var Msh = require( './mongoSessionHandle' ),
    crypto = require('crypto'),

// 过期时间（查过这个时间session将从内存中销毁）
Expire = 30,

session = {
},

handle = {
	
	/**
	 * 导入serial数据
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
	 * 生成新的serial
     * @params {String} name username
     * @params {Object} serial object
	 */
	addSerial: function( name, next ){

		if( !( name in session ) ){
			session[ name ] = {};
		}

		var u  = session[ name ],
			serial = this.newSerial( name ),
			s = u[ serial ] = {};

		// 更新
		this.updateSession( name, serial, function( err, s ){
            next( err, {
                serial: serial,
                token: s.token
            });
        } );
	},

    /**
     * update session token and active date
     * @param name
     * @param serial
     * @param next( err, s )
     */
    updateSession: function( name, serial, next ){
        var that = this;
        this.getSession( name, serial, function( err, s ){
            if( err ){
                next( err );
            }
            else {
                s.token = that.newToken( name, serial );
                s.active = Date.now();
                clearTimeout( s.timer );

                // 设置超时
                s.timer = setTimeout( function(){
                    that.destroy( name, serial );
                }, Expire * 60 * 1000 );

                next( null, s );
            }
        });
    },

    /**
     * update session[ serial ] token
     * @param name
     * @param serial
     * @param next( err, session[ serial ] )
     */
	updateToken: function( name, serial, next ){
        var that = this;
        this.getSession( name, serial, function( err, s ){
            if( err ){
                next( err );
            }
            else {
                s.token = that.newToken( name, serial );
                next( null, s );
            }
        });
	},

    /**
     * update session[ serial ] active date
     * @param name
     * @param serial
     * @param next( err, session[ serial ] )
     */
	updateActive: function( name, serial, next ){
		var that = this;
        this.getSession( name, serial, function( err, s ){
            if( err ){
                next( err );
            }
            else {
                s.active = Date.now();
				clearTimeout( s.timer );

				// 设置超时
				s.timer = setTimeout( function(){
					that.destroy( name, serial );
				}, Expire * 60 * 1000 );

                next( null, s );
            }
        });
	},


    /**
     * get session[ serial ], if not in memory, it will check mongdb, which also fetch the data into memory
     * @param name
     * @param serial
     * @param next( err, session[ serial ] )
     */
	getSession: function( name, serial, next ){
		var u = session[ name ], s, that = this;

		if( u && u[ serial ] ){
			s = u[ serial ];
			next( null, s );
		}
		else {

			// 从数据库中获取session数据
			Msh.get( name, function( err, user ){
				if( err ){
					next( err );
				}
				else {
					if( user ){
						var s = user.sessions[ serial ];
						if( s ){
							// 将数据导入到内存中
							that.importSerial( name, serial, s.token );
							next( null, session[ name ][ serial ] );
						}
						next( null );
					}
					else {
						next( null );
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
     * @param next
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
     */
	save: function( name, serial, next ){
		
		var u = session[ name ], s, newS;

		if( u ){
			s = u[ serial ];
			
			if( s ){

				newS = {
                    serial: s.token
                };

				Msh.save( name, newS, next ); 
			}
			else {
				next({
					type: 'save',
					msg: 'serial: ' + serial + '不存在'
				});
			}
		}
		else {
			next({
				type: 'save',
				msg: '用户名: ' + name + '不存在'
			});
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
