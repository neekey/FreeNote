/** 
 * 封装数据操作
 */

var Mgo = require( './mongoModel' ),
    Muser = Mgo.model( 'user' ),
    errorConf = _freenote_cfg.error;

var handle = {

    /**
     * 返回用户的所有笔记
     * @param username
     * @param next( err, notes )
     *      err: mongo_err | user_not_exist
     */
    getAllNotes: function( username, next ){

        var that = this;

        Muser.findOne( { name: username }, function( err, user ){

            if( err ){

                next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( user ){

                    next( null, user.notes );
                }
                else {

                    next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: username } )
                    });
                }
            }

        });
    },
    /**
     * mongoose 2.3.0 的一个bug，一个medel实例对象, 对一个embeded document只能save一次
     * @see https://github.com/LearnBoost/mongoose/issues/261
     * 因此下面的addNote、delNote，updateNote方法在使用时注意
     * 不要使用已经进行过save的user实例对象作为第一个参数
     */

    /**
     * 添加笔记
     * @param username
     * @param note
     * @param next( err, id )
     *      err: mongo_error | user_not_exist
     */
    add: function( username, note, next ){

        var that = this;

        Muser.findOne( { name: username }, function( err, user ){

            if( err ){

                next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( user ){

                    var oldTags = {},
                        newTags = note.tags,
                        tagObj = user.tags;

                    var id = user.addNote( note );

                    user.save( function( err ){

                        if( err ){

                            next({
                                type: 'mongo_error',
                                msg: errorConf.get( 'mongo_error', err )
                            });
                        }
                        else {

                            that.updateTagNote( oldTags, newTags, tagObj, user, id, function( err ){

                                if( err ){

                                    next( err );
                                }
                                else {

                                    next( null, id );
                                }
                            });
                        }
                    });
                }
                else {

                    next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: username } )
                    });
                }
            }

        });
    },

    /**
     * mongoDB 不允许一次对同一路劲下的数据进行不同类型的操作
     * 在修改笔记的操作中，涉及到添加新的tag和修改旧的tag的操作
     * 因此这边分成两部，先save，再执行下一步
     */

    /**
     * 更新笔记
     * @param username
     * @param id
     * @param note
     * @param next( err )
     *      err: mongo_error | note_not_exist | user_not_exist
     */
    update: function( username, id, note, next ){

        var that = this;

        Muser.findOne( { name: username }, function( err, user ){

            if( err ){
                next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( user ){

                    var _note = user.notes.id( id );

                    if( _note ){

                        var oldTags = _note.tags,
                            newTags = note.tags,
                            tagObj = user.tags;

                        user.updateNote( id, note );

                        that.updateTagNote( oldTags, newTags, tagObj, user, id, function( err ){

                            if( err ){

                                next( err );
                            }
                            else {

                                next( null );
                            }
                        });
                    }
                    else {

                        next( {
                            type: 'note_not_exist',
                            msg: errorConf.get( 'note_not_exist', { name: username, id: id } )
                        });
                    }
                }
                else {

                    next( {
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: username } )
                    });
                }
            }
        });

    },

    /**
     * 删除笔记
     * @param username
     * @param id
     * @param next( err )
     *      err: mongo_error | note_not_exist | user_not_exist
     */
    del: function( username, id, next ){

        Muser.findOne( { name: username }, function( err, user ){

            if( err ){

                next( {
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {

                if( user ){

                    var note = user.notes.id( id );

                    if( note ){

                        user.delNote( id );
                        user.save( function( err ){

                            if( err ){

                                next({
                                    type: 'mongo_error',
                                    msg: errorConf.get( 'mongo_error', err )
                                });
                            }
                            else {

                                next( null );
                            }
                        });
                    }
                    else {

                        next({

                            type: 'note_not_exist',
                            msg: errorConf.get( 'note_not_exist', { id: id, name: name } )
                        });
                    }
                }
                else {

                    next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: name } )
                    });
                }
            }
        });
    },

    /**
     * 根据笔记tags信息的更新，更新相关信息
     * @param oldTags   笔记更改前的tag
     * @param newTags   新笔记的tag
     * @param tagObj    该用户tag对象
     * @param user
     * @param id
     * @param next( err )
     *      err: mongo_error
     */
    updateTagNote: function( oldTags, newTags, tagObj, user, id, next ){


        // update tags info
        // newTags: 新添加的tag
        // delTags: 被移除的tag
        var tags = [];

        // 获取该用户所有tag
        _.each( tagObj, function( tag ){

            tags.push( tag.value );
        });

        var addTags = _.difference( newTags, tags ),        // 该用户新添加的tag
            addNotes = _.difference( newTags, oldTags ),    // 该笔记新添加的tag
            delNotes = _.difference( oldTags, newTags );    // 该笔记中删除的tag

        if( addTags.length > 0 ){

            _.each( addTags, function( tag ){

                user.addTagNote( tag, id );
            });

            user.save( function( err ){

                if( err ){

                    next( {
                        type: 'mongo_error',
                        msg: errorConf.get( 'mongo_error', err )
                    });
                }

                else {

                    var changed = false;

                    if( addNotes.length > 0 ){

                        changed = true;

                        _.each( addNotes, function( tag ){

                            if( _.indexOf( addTags, addNotes ) < 0 ){

                                user.addTagNote( tag, id );
                            }
                        })
                    }

                    if( delNotes.length > 0 ){

                        changed = true;

                        _.each( delNotes, function( tag ){

                            user.delTagNote( tag, id );
                        });
                    }

                    if( changed ){

                        user.save( function( err ){

                            if( err ){

                                next({
                                    type: 'mongo_error',
                                    msg: errorConf.get( 'mongo_error', err )
                                });
                            }
                            else {

                                next( null );
                            }
                        });
                    }
                    else {

                        next( null );
                    }
                }
            });
        }
        else {

            var changed = false;

            if( addNotes.length > 0 ){

                changed = true;

                _.each( addNotes, function( tag ){

                    user.addTagNote( tag, id );
                })
            }

            if( delNotes.length > 0 ){

                changed = true;

                _.each( delNotes, function( tag ){

                    user.delTagNote( tag, id );
                });
            }

            if( changed ){

                user.save( function( err ){

                    if( err ){

                        next({
                            type: 'mongo_error',
                            msg: errorConf.get( 'mongo_error', err )
                        });
                    }
                    else {

                        next( null );
                    }
                });
            }
            else {

                next( null );
            }

        }
    }
};
module.exports = handle;

