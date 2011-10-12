var express = require( 'express' ),
	app = express.createServer(),
	noteHandle = require( './modules/noteHandle' ),
	Rh = require( './modules/routerHandle' );


// 设置渲染引擎
require( 'jade' );
app.set( 'view engine', 'jade' );
app.use( express.bodyParser() );
app.use( express.cookieParser() );

// 初始化路由
Rh.init( app );

// js+css files
app.get( '/*.(js|css)', function( req, res ){
	var type = 'js';
	if( req.url.substring( req.url.length - 3 ) == 'css' ){
		type = 'css';
	}
  	res.sendfile( "./assets/" + type + req.url );
});

app.get( '/', function( req, res ){
	res.render( 'index', {
		layout: false
	});	
});

/* CRUD router */

// read
app.get( '/res/note/:id', function( req, res ){
	var id = req.params.id;
	console.log( 'id: ' + id );
	noteHandle.read( id, function( results ){
		if( results.length ){
			res.send( results[ 0 ] );
		}
		else {
			res.send( 404 );
		}
	});
});

// create
app.post( '/res/note/', function( req, res ){
	var data = req.body;
	noteHandle.add( data.note, data.author, function( results ){
		res.send( { id: results.insertId } );
	});
});
// create user
app.post( '/res/user/', function( req, res ){
	var data = req.body;
	Mh.addUser( data.name, data.password, function( err, user ){
		if( err ){
			res.send( 404, err );
		}
		else {
			res.send({ _id: user._id });
		}
	});
});

// update
app.put( '/res/note/:id', function( req, res ){
	var id = req.params.id,
		data = req.body;
	noteHandle.update( id, data, function( results ){
			res.send({});
		});

});
// delete
app.del( '/res/note/:id', function( req, res ){
	var id = req.params.id;
	noteHandle.del( id, function(){
		res.send({result: true});
	});
});

app.listen(1111);

