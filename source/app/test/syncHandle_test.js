/**
 * syncHandle TEST
 */

var sh = require( '../modules/syncHandle' );

exports.run = function( req, res ){

    var type = req.params.type,
        p1 = req.params.p1,
        p2 = req.params.p2,
        p3 = req.params.p3;

    switch( type ){

        case 'add':
            sh.add( p1, p2, function( err, s ){

                if( err ){

                    res.send( err );
                }
                else {

                    res.send( s );
                }
            });
            break;

        case 'addchange':

            sh.addChange( p1, p2, p3, {
                type: 'add',
                note: {
                    content: 'neekey',
                    tags: [ 'tag1', 'tag2' ]
                }
            }, function( err ){

                if( err ){

                    res.send( err );
                }
                else {

                    res.send( 'addChange success' );
                }
            });
            break;

        case 'get':

            sh.get( p1, function( err, s ){

                if( err ){

                    res.send( err );
                }
                else {

                    res.send( s );
                }
            });
            break;

        case 'getfrommemory':

            var s = sh.getFromMemory( p1 );
            res.send( s );
            break;

        case 'getfromdb':

            sh.getFromDB( p1, function( err, s ){

                if( err ){

                    res.send( err );
                }
                else {

                    res.send( s );
                }
            });
            break;

        case 'del':

            sh.del( p1, p2 );
            res.send( 'del done' );
            break;

        case 'destroy':

            sh.destroy( p1, p2, function( err ){
                if( err ){

                    res.send( err );
                }
                else {
                    res.send( 'destroy success' );
                }
            });
            break;

        case 'save':

            sh.save( p1, p2, function( err ){

                if( err ){

                    res.send( err );
                }
                else {

                    res.send( 'save success' );
                }
            })
            break;

        case 'compare':

            var list1 = {
                1: {
                    note: 'test',
                    date: 12345
                },
                2: {
                    note: 'neekey',
                    date: 2222
                },
                3: {
                    note: 'haha',
                    date: 4444
                },
                4: {
                    note: 'takjal',
                    date: 4444
                }
            };

            var list2 = {
                2: {
                    note: 'neekey2',
                    date: 33333
                },
                3: {
                    note: 'haha2',
                    date: 4444
                },
                5: {
                    note: 'taaaaaaa5',
                    date: 4444
                }
            };
            
            res.send( sh.compare( list1, list2 ) );
            break;

        default:
            res.send( 404 );
            break;
    }
};