/**
 * 内存中的session信息
 */
var _ = require( 'underscore' ),

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
	getSession: function( name, serial ){
		var u = session[ name ], s;

		if( u ){
			s = u[ serial ];
			if( s ){
					return s;
			}
		}
		else {
			return false;
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
	 * 销毁session
	 * @param {String} name
	 * @param {String} serial
	 */
	destroy: function( name, serial ){
		var u = session[ name ];

		if( u ){
			delete u[ serial ];
		}
	}
};
