/**
 * every router is for an unit test
 */

// global modules
require( './modules/global_module.js' );

// express
var express = require( 'express' ),
app = express.createServer();

// 设置渲染引擎
require( 'jade' );
app.set( 'views engine', 'jade' );
app.use( express.bodyParser() );
app.use( express.cookieParser() );

app.configure(function(){
    app.set('views', './test/views');
    // => "/absolute/path/to/views"
 });

// js+css files
app.get( '/*.(js|css)', function( req, res ){
	var type = 'js';
	if( req.url.substring( req.url.length - 3 ) == 'css' ){
		type = 'css';
	}
  	res.sendfile( "./test/assets/" + type + req.url );
});

// ====== cookieHandle ======
app.get( '/unittest/cookieHandle/:type', function( req, res ){
	
	var test = require( './test/cookieHandle_test' );
	test.run( req, res );
});

// ====== mongoSessionHandle ======
app.get( '/unittest/mongoSessionHandle/:type/:name/:param', function( req, res ){
   var msh = require( './test/mongoSessionHandle_test' );
   msh.run( req, res );
});

// ====== sessionHandle ======
app.get( '/unittest/sessionHandle/:type/:p1/:p2/:p3', function( req, res ){
   var sh = require( './test/sessionHandle_test' );
   sh.run( req, res );
});

// ====== auth ======
app.get( '/unittest/auth/:type/:p1/:p2', function( req, res ){
   var ah = require( './test/auth_test' );
    ah.run( req, res );
});

// ====== mongoNoteHandle ======
app.get( '/unittest/mongoNoteHandle', function( req, res ){

    res.render( 'mongoNoteHandle/index.jade', {
        layout: false,
        title: 'mongoNoteHandle',
        js: [ '/mongoNoteHandle/index.js' ]
    });
});

app.post( '/unittest/mongoNoteHandle', function( req, res ){

    var Mnh = require( './test/mongoNoteHandle_test' );
    Mnh.run( req, res );
});
// ====== routerHandle - auth ======
app.get( '/unittest/routerhandle_auth', function( req, res ){

   res.render( 'auth/index.jade', {
       layout: false,
       main: 'auth/index.jade',
       title: 'routerHandle_auth',
       js: [ '/models/user.js', '/auth/index.js' ]
   });
});

// ====== syncHandle ====== */
app.get( '/unittest/synchandle/:type/:p1/:p2/:p3', function( req, res ){

    var sh = require( './test/syncHandle_test' );
    sh.run( req, res );
});

app.listen( 2222 );
