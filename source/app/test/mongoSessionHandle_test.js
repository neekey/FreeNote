/**
 * mongoSessionHandle test
 */

var Msh = require( '../modules/mongoSessionHandle' );

var test = module.exports = {

    run: function( req, res ){

        var type = req.params.type,
            name = req.params.name,
            param = req.params.param;

        switch( type ){

            case 'get':
                Msh.get( name, function( err, s ){
                    console.log( 'get sessions from user ' + param );
                    if( err ){
                        res.send( err );
                    }
                    else {
                        res.send( s );
                    }
                });
                break;

            case 'update':
                Msh.update( name, {
                    _serial1: 'token',
                    serial1: 'token2',
                    serial2: 'token2'
                }, function( err ){
                    if( err ){
                        res.send( err );
                    }
                    else {
                        res.send( 'update success' );
                    }
                });

                break;

            case 'del':
                Msh.del( name, param, function( err ){
                    if( err ){
                        res.send( err );
                    }
                    else {
                        res.send( 'del success');
                    }
                });

                break;

            case 'delall':
                Msh.delAll( name, function( err ){
                    if( err ){
                        res.send( err );
                    }
                    else {
                        res.send( 'delAll success');
                    }
                });

                break;

            default:
                res.send( 404 );
                break;
        }
    }
};