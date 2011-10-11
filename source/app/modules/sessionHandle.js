/**
 * 内存中的session信息
 */
var _ = require( 'underscore' ),
	
	Msh = require( './mongoSessionHandle' ),

// 过期时间（查过这个时间session将从内存中销毁）
Expire = 30,

session = {
},

handle = {
	
	/**
	 * 导入serial数据
	 */
	importSerial: function( name, serail, token ){
		if( !( name in session ) ){
			session[ name ] = {};
		}

		session[ name ][ serial ][ 'token' ] = token;
	},

	/**
	 * 生成新的serial	 
	 */
	addSerial: function( name ){

		if( !( name in session ) ){
			session[ name ] = {};
		}

		var u  = session[ name ],
			serial = this.getSerial( name ),
			s = u[ serial ] = {};

		// 更新
		this.updateActive( name, serial );

		return {
			serial: serial,
			token: s.token
		};

	},

	/**
	 * 修改	session
	 * @param {String} name
	 * @param {String} serial
	 * @returns {String} token
	 */
	updateToken: function( name, serial ){
		var u = session[ name ], s;
		if( u ){
			s = u[ serial ];
			if( s ){
				s.token = this.newToken( name, serial );
				this.updateActive( name, serial );
				return s.token;
			}
		}
	},

	/**
	 * 更新session的活跃时间
	 * @param {String} name
	 * @param {String} serial
	 */
	updateActive: function( name, serial ){
		var u = session[ neme ], s, that = this;
		if( u ){
			s = u[ serial ];
			if( s ){
				s.active = Date.now();
				clearTimeout( s.timer );

				// 设置超时
				s.timer = setTimeout( function(){
					that.destroy( name, serial );
				}, Exprie * 60 * 1000 );
			}
		}
	},


	/**
	 * 获取指定的session数据
	 * @param {String} name
	 * @param {String} serial
	 * @returns {Session|Boolean} 
	 */
	getSession: function( name, serial, next ){
		var u = session[ name ], s, that = this;

		if( u ){
			s = u[ serial ];
			if( s ){
					next( null, s );
			}
		}
		else {

			// 从数据库中获取session数据
			Msh.get( name, function( err, user ){
				if( err ){
					next( err );
				}
				else {
					var s = user.sessions[ serial ];
					if( s ){
						// 将数据导入到内存中
						that.importSerial( name, serial, s.token );
						next( null, { token: s.token } );
					}
				}
			});
		}
	},

	/**
	 * 检查会在内存中是否过期，如果过期，则销毁	 
	 * @param {String} name
	 * @param {String} serial
	 * @returns {Boolean}
	 */
	ifExpired: function( name, serial ){
		var u = session[ name ], s,
			curTime = Date.now();

		if( u ){
			s = u[ serial ];
			if( s ){
				if( curTime - s.active > ( Expire * 60 * 1000 ) ){
					this.destroy( name, serial );
					return true;
				}
				else {
					return false;
				}
			}
		}
		else {
			return true;
		}
	},

	/**
	 * 从内存中删除session
	 */
	del: function( name, serial ){
		var u = session[ name ];

		if( u ){
			delete u[ serial ];
		}
	},

	/**
	 * 销毁session, 从内存和数据库中同时删除数据
	 * @param {String} name
	 * @param {String} serial
	 */
	destroy: function( name, serial, next ){

		// 从内存中删除
		this.del( name, serial );

		// 从数据库中删除
		Msh.del( name, serial, next );
	},

	/**
	 * 将session信息保存到数据库中
	 */
	save: function( name, serial, next ){
		
		var u = session[ name ], s, newS;

		if( u ){
			s = u[ serial ];
			
			if( s ){
				newS = {};
				newS[ serial ] = s.token;
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
	}
};

module.exports = handle;
