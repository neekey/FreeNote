/**
 * auth test
 */
var Ah = require( '../modules/auth' );

exports.run = function( req, res ){
   var type = req.params.type,
       p1 = req.params.p1,
       p2 = req.params.p2;

   switch( type ){
       case 'login':
            Ah.login( req, res, p1, p2, function( err, s ){
               if( err ){
                   res.send( err );
               }
               else {
                   res.send( s );
               }
            });
            break;

       case 'check':
            Ah.check( req, res, function( err, result ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( result );
                }
            });
            break;
       case 'logout':
            Ah.logout( req, res, function( err ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( 'logout success' );
                }
            });
            break;
       case 'register':
            Ah.register( req, res, p1, p2, function( err, s ){
                if( err ){
                    res.send( err );
                }
                else {
                    res.send( s );
                }
            });
            break;
            
       default:
            res.send( 404 );
            break;
   }
};