/**
 * mongoNoteHandle test
 */

var Mnh = require( '../modules/mongoNoteHandle' );

exports.run = function( req, res ){

    var data = req.body,
        type = data.type,
        name = data.name,
        id = data.id,
        note = data.note,
        tags = data.tags;

    switch( type ){

        case 'add':

            Mnh.add( name, {
                content: note,
                tags: tags
            }, function( err, id ){

                if( err ){

                    res.send( 404, err );
                }
                else {

                    res.send({
                        result: true,
                        id: id
                    });
                }
            });

            break;

        case 'update':

            Mnh.update( name, id, {
                content: note,
                tags: tags
            }, function( err ){

                if( err ){

                    res.send( 404, err );
                }
                else {

                    res.send( 'update success!' );
                }
            });

            break;

        case 'del':

            Mnh.del( name, id, function( err ){

                if( err ){

                    res.send( 404, err );
                }
                else {

                    res.send( 'delete success!' );
                }
            });

            break;

        default:

            res.send( 404 );
            break;
    }
};