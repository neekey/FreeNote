exports.run = function( req, res ){

var cookie = require( '../modules/cookieHandle' ),
		type = req.params.type,
		_cookie = req.cookies;
	
	console.log( 'req.cookies:' );
	console.log( _cookie );
	
	// fn: set
	if( type === 'set' ){
		
		cookie.set( res, { a: 'a', b: 'b' } );
		res.send();
	}
	// fn: clear
	else if( type === 'clearArr' ){
		cookie.clear( res, [ 'a', 'b' ] );
		cookie.clear( res, 'b' );
		res.send();
	}
	else if( type === 'clearStr' ){
		cookie.clear( res, 'a' );
		cookie.clear( res, 'b' );
		res.send();
	}
	else if( type === 'clearBoth' ){
		cookie.clear( res, 'a' );
		cookie.clear( res, [ 'b' ] );
		res.send();
	}
	// for you to check cookie
	else {
		res.send( _cookie );
	}

};
