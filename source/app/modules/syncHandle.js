/**
 * syncHandle
 */
var Msh = require( './mongoSyncHandle' ),
    errorConf = _freenote_cfg.error,
    Expire = 30;

var Sync = {},
    syncDiff = {};
/*
var sync = {
    serial1: {
        sync: Date.now(),
        changeList: {
            note_id: {
                type: 'del|add|update',
                note: note,
                date: 
            }
        }
    }
}
*/

var handle = {

    /**
     * add an new syncTable to memory
     * @param name
     * @param serial
     * @param next( err, syncTable )
     *      err: sync_already_exist | mongo_err | user_not_exist | syncs_not_found
     */
    add: function( name, serial, next ){

        this.get( name, function( err, syncs ){

            if( err && err.type !== 'syncs_not_found' ){

                next( err );
            }
            else {

                if( !( name in Sync ) ){

                    Sync[ name ] = {};
                }

                var syncs = Sync[ name ];

                console.log( syncs );

                if( serial in syncs ){

                    next({
                        type: 'sync_already_exist',
                        msg: errorConf.get( 'sync_already_exist', { name: name, serial: serial } )
                    });
                }
                else {

                    syncs[ serial ] = {
                        synced: false,
                        sync: null,
                        changeList: {}
                    };

                    return next( null, syncs[ serial ] );
                }
            }
        });


    },

    addChange: function( name, serial, id, change, next ){

        this.get( name, function( err, syncs ){

            if( err ){

                next( err );
            }
            else {

                if( serial in syncs ){

                    var s = syncs[ serial ],
                        c = s[ id ];

                    change[ 'date' ] = Date.now();

                    s[ id ] = change;

                    next( null );
                }
                else {

                    next({
                        type: 'sync_not_found',
                        msg: errorConf.get( 'sync_not_found', { name: name, serial: serial } )
                    })
                }
            }
        });
    },

    /**
     * get syncs
     * @param name
     * @param next( err, syncs )
     *      err: mongo_err | user_not_exist | syncs_not_found
     */
    get: function( name, next ){

        var syncs = this.getFromMemory( name ),
            that = this;

        if( syncs && ( !syncDiff[ name ] || syncDiff[ name ].length === 0 ) ){

            next( null, syncs );
        }
        else {

            this.getFromDB( name, function( err, s ){

                if( err ){

                    next( err );
                }
                else {

                    // import to memory
                    _.each( s, function( _s, key ){

                        if( !Sync[ name ] ){

                            Sync[ name ] = {};
                        }

                        Sync[ name ][ key ] = _s;

                        // update timer
                        that.updateTimer( name, key );
                    });

                    console.log( Sync[ name ] );
                    // seset sessionSyn
                    syncDiff[ name ] = [];

                    // 不能直接返回s，因为内存中原有可能存在数据库中尚没有的数据
                    next( null, Sync[ name ] );
                }
            })
        }
    },

    updateTimer: function( name, serial ){

        var that = this;

        var s = Sync[ name ][ serial ];

        // clear timer
        s.clearTimer && s.clearTimer();

        // set timeout
        var timer = setTimeout( function(){

            // save sync to mongodb
            that.save( name, serial, function( err ){
                if( err ){
                    console.log( err );
                }
                else {
                    // delete sync from memory
                    that.del( name, serial );
                    console.log( 'user ' + name + '\' session: ' + serial + ' is expried!' );
                }
            });
        }, Expire * 60 * 1000 );

        // reset the clear function
        s.clearTimer = function(){
            clearTimeout( timer );
        };
    },

    /**
     * get syncs from memory
     * @param name
     * @return s
     */
    getFromMemory: function( name ){

        return Sync[ name ];
    },

    /**
     * get syncs from mongoDB
     * @param name
     * @param next( err, s  )
     *      err: mongo_err | user_not_exist | syncs_not_found
     */
    getFromDB: function( name, next ){

        Msh.get( name, function( err, s ){

            if( err ){

                next( err );
            }
            else {

                next( null, s );
            }
        });
    },

    /**
     * delete sync from memory
     * @param name
     * @param serial
     */
    del: function( name, serial ){

        var s = Sync[ name ];

        if( s ){

            delete s[ serial ];

            if( !syncDiff[ name ] ){

                syncDiff[ name ] = [];
            }
            if( _.indexOf( syncDiff[ name ], serial ) < 0 ){

                syncDiff[ name ].push( serial );
            }
        }
    },

    /**
     * delete sync from both memory and database
     * @param name
     * @param serial
     * @param next( err )
     *      err: mongo_error | user_not_exist
     */
    destroy: function( name, serial, next ){

        // 从内存中删除
        this.del( name, serial );

        // 从数据库中删除
        Msh.del( name, serial, function( err ){

            if( !err ){

                var index = _.indexOf( syncDiff[ name ], serial );
                syncDiff[ name ].splice( index, 1 );
            }

            next( err );
        });
    },

    /**
     * save sync[ serial ] to mongoDB
     * @param name
     * @param serial
     * @param next( err )
     *      err: mongo_error | user_not_exist
     */
    save: function( name, serial, next ){

        var syncs = Sync[ name ], s, newS;

        if( syncs ){

            s = syncs[ serial ];

            if( s ){

                newS = {};
                newS[ serial ] = s;

                Msh.update( name, newS, next );
            }
            else {

                next( null );
            }
        }
        else {

            next( null );
        }
    },

    /**
     * compare 2 changelist and return the result
     * @param list1
     * @param list2
     */
    compare: function( list1, list2 ){

        var _list1 = _.defaults( _.clone( list1 ), list2 ),
            _list2 = _.defaults( _.clone( list2 ), list1 ),
            list = {};

        _.each( _list1, function( value1, key ){

            var value2 = _list2[ key ];

            if( value1.date > value2.date ){

                list[ key ] = value1;
            }
            else {

                list[ key ] = value2;
            }
        });

        return list;
    }
}

module.exports = handle;