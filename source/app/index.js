// load config
require( './modules/config' );

var express = require( 'express' ),
    noteHandle = require( './modules/noteHandle' ),
    Rh = require( './modules/routerHandle' ),
    app = express.createServer();


// 设置渲染引擎
require( 'jade' );
app.set( 'views engine', 'jade' );
app.use( express.bodyParser() );
app.use( express.cookieParser() );

// 初始化路由
Rh.init( app );

// js+css files
app.get( '/*.(js|css)', function( req, res ){

    ifFirebug = req.url.substring( 1, 13 );

    if( ifFirebug !== 'firebug-lite' ){
        var type = 'js';
        if( req.url.substring( req.url.length - 3 ) == 'css' ){
            type = 'css';
        }
        res.sendfile( "./assets/" + type + req.url );
    }
    else {

        res.sendfile( './assets' + req.url );
    }
});

// firebug html files
app.get( '/firebug-lite/*.(html)', function( req, res ){

    res.sendfile( './assets' + req.url );
});

// img files
app.get( '/*.(jpg|gif|png)', function( req, res ){


    ifFirebug = req.url.substring( 1, 13 );

    if( ifFirebug !== 'firebug-lite' ){
        
        res.sendfile( './assets/img' + req.url );
    }
    else {

        res.sendfile( './assets' + req.url );
    }
});

// tpl files
app.get( '/*.tpl?', function( req, res ){

    res.sendfile( "./assets/js/tpls" + req.url );
});

app.get( '/', function( req, res ){
    /*
    res.render( 'index.jade', {
        layout: false
    }); */
    res.render( 'login.jade', {
        layout: false
    });
});

app.listen(1122);

