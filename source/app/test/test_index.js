/**
 * every router is for an unit test
 */

// global modules
require( '../modules/global_module.js' );

// express
var express = require( 'express' ),
app = express.createServer();

// 设置渲染引擎
require( 'jade' );
app.set( 'view engine', 'jade' );
app.use( express.bodyParser() );
app.use( express.cookieParser() );

// ====== cookieHandle ======
app.get( '/unittest/cookieHandle/:type', function( req, res ){
	
	var test = require( './cookieHandle_test' );
	test.run( req, res );
});

// ====== mongoSessionHandle ======
app.get( '/unittest/mongoSessionHandle/:type/:name/:param', function( req, res ){
   var msh = require( './mongoSessionHandle_test' );
   msh.run( req, res );
});

// ====== sessionHandle ======
app.get( '/unittest/sessionHandle/:type/:p1/:p2/:p3', function( req, res ){
   var sh = require( './sessionHandle_test' );
   sh.run( req, res );
});

app.listen( 2222 );
