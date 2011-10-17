/**
 * sync mongo handle
 */

var Mgo = require( './mongoModel' ),
	Muser = Mgo.model( 'user' ),
    errorConf = _freenote_cfg.error;

var handle = {

    /**
     * get syncs from mongoDB
     * @param name
     * @param next( err, sync )
     *      err: mongo_err | user_not_exist | syncs_not_found
     */
    get: function( name, next ){

        Muser.findOne( { name: name }, function( err, user ){

            if( err ){

                next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( !user ){

                    next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: name })
                    });
                }
                else {

                    if( user.syncs && _.keys( user.syncs ).length > 0 ){

                        next( null, user.syncs );
                    }
                    else {

                        next({
                            type: 'syncs_not_found',
                            msg: errorConf.get( 'syncs_not_found', { name: name } )
                        });
                    }
                }
            }
        });
    },

    /**
     * update sync
     * @param name
     * @param syncs
     * @param next( err )
     *      err: mongo_error | user_not_exist
     */
    update: function( name, syncs, next ){

        Muser.findOne( { name: name }, function( err, user ){

            if( err ){

                next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( !user ){

                    next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: name })
                    });
                }
                else {

                    user.updateSync( syncs );
                    user.save(function( err ){

                        if( err ){

                            next({
                                type: 'mongo_error',
                                msg: errorConf.get( 'mongo_error', err )
                            });
                        }
                        else {

                            next( null );
                        }
                    })
                }
            }
        });
    },

    /**
     * del sync[ serial ]
     * @param name
     * @param serial
     * @param next( err )
     *      err: mongo_error | user_not_exist
     */
    del: function( name, serial, next ){

        Muser.findOne( { name: name }, function( err, user ){

            if( err ){

                next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( !user ){

                    next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: name })
                    });
                }
                else {

                    user.delSync( serial );
                    user.save(function( err ){

                        if( err ){

                            next({
                                type: 'mongo_error',
                                msg: errorConf.get( 'mongo_error', err )
                            });
                        }
                        else {

                            next( null );
                        }
                    })
                }
            }
        });
    }
};

module.exports = handle;