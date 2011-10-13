var Sh = require( '../modules/sessionHandle' );

exports.run = function( req, res ){
    var type = req.params.type,
        p1 = req.params.p1,
        p2 = req.params.p2,
        p3 = req.params.p3;

    switch( type ){

        case 'import':

            Sh.importSerial( p1, p2, p3 );
            res.send( 'import serial done' );
            break;

        case 'addserial':

            Sh.addSerial( p1, function( err, s ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( s );
                }
            });
            break;

        case 'updatesession':

            Sh.updateSession( p1, p2, function( err, s ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( s );
                }
            });
            break;

        case 'updateactive':

            Sh.updateActive( p1, p2, function( err, s ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( s );
                }
            });
            break;

        case 'updatetoken':

            Sh.updateToken( p1, p2, function( err, s ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( s );
                }
            });
            break;

        case 'gettoken':

            Sh.getToken( p1, p2, function( err, token ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( token );
                }
            });
            break;

        case 'getsession':

            Sh.getSession( p1, function( err, s ){
               if( err ){
                   res.send( err );
               }
               else {
                   res.send( s );
               }
            });
            break;

        case 'del':

            Sh.del( p1, p2 );
            res.send( 'del done' );
            break;

        case 'destroy':

            Sh.destroy( p1, p2, function( err ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( 'destroy success' );
                }
            });
            break;

        case 'save':

            Sh.save( p1, p2, function( err ){

                if( err ){
                    res.send( err );
                }
                else {
                    res.send( 'save done' );
                }
            });
            break;

        case 'newserial':

            res.send( Sh.newSerial( p1 ) );
            break;

        case 'newtoken':

            res.send( Sh.newToken( p1, p2 ) );
            break;

        case 'getsessionfrommemory':

            var s = Sh.getSessionFromMemory( p1 );

            if( s ){
                res.send( s );
            }
            else {
                res.send( 'user ' + p1 + ' don\'t find session' );
            }
            break;

        case 'getsessionfromdb':

            Sh.getSessionFromDB( p1, function( err, s ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( s );
                }
            })
            break;
        
        default:
            res.send( 404 );
            break;
    }
}