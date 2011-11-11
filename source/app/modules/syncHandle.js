/**
 * syncHandle
 */
var Msh = require( './mongoSyncHandle' ),
    Mnh = require( './mongoNoteHandle' ),
    errorConf = _freenote_cfg.error,
    Expire = 30;

var Sync = {},
    syncDiff = {};
/*
var sync = {
    name: {
        serial1: {
            sync: Date.now(),
            changeList: [{
                type: 'del|add|update',
                note: note,
                date:,
                _id:
            }],
            changeIndex: {
                _id: index
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

        var that = this;

        this.get( name, function( err, syncs ){

            if( err && err.type !== 'syncs_not_found' ){

                next( err );
            }
            else {

                if( !( name in Sync ) ){

                    Sync[ name ] = {};
                }

                var syncs = Sync[ name ];

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
                        changeList: [],
                        changeIndex: {}
                    };

                    that.updateTimer( name, serial );

                    return next( null, syncs[ serial ] );
                }
            }
        });
    },


    addChange: function( name, serial, id, change, next ){

        var that = this;

        this.get( name, function( err, syncs ){

            if( err ){

                next( err );
            }
            else {

                if( serial in syncs ){

                    var s = syncs[ serial ], index;

                    change[ 'date' ] = Date.now();

                    change[ '_id' ] = id;

                    // 是否已经存在该id对应的修改
                    if( id in s.changeIndex ){

                        index = s.changeIndex[ id ];
                        s.changeList[ index ] = change;
                    }
                    else {

                        s.changeList.push( change );
                        s.changeIndex[ id ] = s.changeList.length - 1;
                    }

                    that.updateTimer( name, serial );

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

    /**
     * 清理指定序列
     * @param name
     * @param serial
     * @param next( err, sync )
     *      err: mongo_err | user_not_exist | syncs_not_found
     */
    clearChnage: function( name, serial, next ){

        var that = this;

        this.get( name, function( err, syncs ){

            if( err ){

                next( err );
            }
            else {

                if( serial in syncs ){

                    var s = syncs[ serial ], index;

                    s.sync = Date.now();

                    s.changeList = [];

                    s.changeIndex = {};

                    that.updateTimer( name, serial );

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

    updateTimer: function( name, serial ){

        var that = this;

        var s = Sync[ name ][ serial ];

        // clear timer
        if( s.clearTimer && _.isFunction( s.clearTimer ) ){

            s.clearTimer();
        }

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
     * @param sync1
     * @param sync2
     */
    compare: function( clientSync, serverSync ){

        var index1 = clientSync.changeIndex,
            index2 = serverSync.changeIndex,
            clientChange = [],
            serverChange = [],
            change1 = clientSync.changeList,
            change2 = serverSync.changeList;

        // 遍历客户端中带来的更改
        _.each( change1, function( changeC ){

            var changeS = change2[ index2[ changeC._id ] ],
                change;

            if( !changeS ) {

                change = changeC;
            }
            else if( changeC.date > changeS.date ){

                change = changeC;
            }
            else {

                return;
            }

            clientChange.push( change );
        });

        // 遍历服务器端中的更改
        _.each( change2, function( changeS ){

            var changeC = change1[ index1[ changeS._id ] ],
                change;

            if( !changeC ) {

                change = changeS;
            }
            else if( changeS.date > changeC.date ){

                change = changeS;
            }
            else {

                return;
            }

            serverChange.push( change );
        });

        return {
            client: clientChange,
            server: serverChange
        };
    },

    sync: function( name, serial, clientSync, next ){

        var that = this;

        this.get( name, function( err, serverSyncs ){

            var sync = serverSyncs[ serial ],
                compareResult = that.compare( clientSync, sync),
                clientChange = compareResult[ 'client' ],
                serverChange = compareResult[ 'server' ],
                clientChangeLen = clientChange.length,
                curClientCount = 0,
                ifError = false;

            _.each( clientChange, function( s ){

                var type = s.type;

                if( type === 'add' ){

                    Mnh.add( name, s.note, function( err, _id ){

                        if( ifError ){

                            return;
                        }
                        else {

                            if( err ){

                                ifError = true;

                                next( err );

                                return;
                            }
                            else {

                                s._id = _id;
                                s.note._id = _id;

                                curClientCount++;

                                // 若所有更改都已经加入到数据库，则更新所有同步表
                                if( curClientCount === clientChangeLen ){

                                    updateAllSync();
                                }
                            }
                        }
                    });
                }
                else if( type === 'update' ){

                    Mnh.update( name, s._id, s.note, function( err ){

                        if( ifError ){

                            return;
                        }
                        else {

                            if( err ){

                                ifError = true;

                                next( err );

                                return;
                            }
                            else {

                                curClientCount++;

                                // 若所有更改都已经加入到数据库，则更新所有同步表
                                if( curClientCount === clientChangeLen ){

                                    updateAllSync();
                                }
                            }
                        }
                    });
                }
                else if( type === 'del' ){

                    Mnh.del( name, s._id, function( err ){

                        if( ifError ){

                            return;
                        }
                        else {

                            if( err ){

                                ifError = true;

                                next( err );

                                return;
                            }
                            else {

                                curClientCount++;

                                // 若所有更改都已经加入到数据库，则更新所有同步表
                                if( curClientCount === clientChangeLen ){

                                    updateAllSync();
                                }
                            }
                        }
                    })
                }

                function updateAllSync(){

                    var syncLen = _.keys( serverSyncs ).length,
                        syncCount = 0;

                    _.each( serverSyncs, function( sync, key ){

                        var changeCount = 0;

                        _.each( clientChange, function( change ){

                            that.addChange( name, key, change._id, change.note, function( err ){

                                if( ifError ){

                                    return;
                                }
                                else {

                                    if( err ){

                                        next( err );

                                        ifError = true;

                                        return;
                                    }
                                    else {

                                        changeCount++;

                                        if( changeCount === clientChangeLen ){

                                            syncCount++;

                                            if( syncCount === syncLen ){

                                                // 清空当前序列的 服务器端的同步表
                                                that.clearChnage( name, serial, function( err, s ){

                                                    if( err ){

                                                        next( err );
                                                    }
                                                    else {

                                                        // 构造需要返回给客户端的同步信息
                                                        _.each( clientChange, function( change ){

                                                            if( change.type === 'add' ){

                                                                serverChange.push( change );
                                                            }
                                                        });

                                                        next( null, serverChange );
                                                    }
                                                });
                                                
                                            }
                                        }
                                    }
                                }

                            });
                        });

                    });
                }

            });

        });
    }
}

module.exports = handle;