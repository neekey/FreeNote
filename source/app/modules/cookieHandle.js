/**
 * a simple cookie handle for freenote session
 */
var handle = {
	
	/**
	 * set cookie
	 * @param {Response} res
	 * @param {Object} cookie { name: value, name2: value2 }
	 * @param {String} '/'
	 */
	set: function( res, cookie, path ){
		var key;
		path = path || '/';

		for( key in cookie ){
			res.cookie( key, cookie[ key ], { path: path } );
		}
	},

	/**
	 * clear cookie
	 * @param {Response} res
	 * @param {Array|String} cookie
	 * @param {String} '/'
	 */
	clear: function( res, cookie, path ){

		path = path || '/';

		if( typeof cookie === 'string' ){
			res.clearCookie( cookie, { path: path } );
		}
		else {
			var i;
			for( i = 0; cookie[ i ]; i++ ){
				res.clearCookie( cookie[ i ], { path: path } );
			}
		}
	}
};

module.exports = handle;
