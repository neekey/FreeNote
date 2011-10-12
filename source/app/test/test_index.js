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

app.listen( 2222 );
