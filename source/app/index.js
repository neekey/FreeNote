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
    console.log( ifFirebug );
    if( ifFirebug !== 'firebug-lite' ){
        var type = 'js';
        if( req.url.substring( req.url.length - 3 ) == 'css' ){
            type = 'css';
        }
        console.log( "./assets/" + type + req.url );
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
    console.log( ifFirebug );
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
    res.render( 'index.jade', {
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

