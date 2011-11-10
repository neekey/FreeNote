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
                sync: Date.now(),
                changeList: [
                    {
                        type: 'add',
                        date: 12345,
                        note: {
                            id: 12,
                            content: 'test'
                        },
                        _id: 12
                    },
                    {
                        type: 'update',
                        date: 12346,
                        note: {
                            id: 13,
                            content: 'test'
                        },
                        _id: 13
                    },
                    {
                        type: 'update',
                        date: 12346,
                        note: {
                            id: 15,
                            content: 'test'
                        }
                    }

                ],
                changeIndex: {

                    12: 0,
                    13: 1
                }
            };

            var list2 = {
                sync: Date.now(),
                changeList: [
                    {
                        type: 'add',
                        date: 12345,
                        note: {
                            id: 13,
                            content: 'test'
                        },
                        _id: 13
                    },
                    {
                        type: 'update',
                        date: 12345,
                        note: {
                            id: 11,
                            content: 'test'
                        },
                        _id: 11
                    },
                    {
                        type: 'update',
                        date: 12345,
                        note: {
                            id: 12,
                            content: 'test'
                        },
                        _id: 12
                    }
                ],
                changeIndex: {
                    13: 0,
                    11: 1,
                    12: 2
                }
            };
            
            res.send( sh.compare( list1, list2 ) );
            break;

        default:
            res.send( 404 );
            break;
    }
};