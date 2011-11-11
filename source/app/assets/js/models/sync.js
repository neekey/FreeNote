/**
 * sync table in client
 */

(function( APP ){

    var MODS = APP.mods,
        MODELS = APP.models;

    var Mchange = Backbone.Model.extend({

        defaults: {
            type: null,
            date: null,
            id: null,
            _id: null,
            note: null
        },

        localStorage: new MODS.localStorageStore( 'changes' ),

        initialize: function(){

            this.bind( 'change', function(){
                this.save({}, {
                    silent: true
                });
            }, this );
        },

        noteUpdate: function( m ){

            console.log( 'model change' );
            
            this.set({
                'note': m.toJSON(),
                'date': Date.now()
            });
        },
        
        noteDestroy: function( m ){

            this.set({
                'note': m.toJSON(),
                'date': Date.now(),
                'type': 'del'
            });
        }
    }),

    CLchange = Backbone.Collection.extend({

        model: Mchange,

        localStorage: new MODS.localStorageStore( 'changes' ),

        initialize: function(){

            // 读取已经有的同步表信息
            this.fetch();
        },

        /**
         * 初始化fetch后执行
         * 寻找每一条变更对应的model，绑定事件
         * @param notes
         */
        bindModels: function( notes ){

            var that = this;

            this.forEach( function( m ){

                var model = notes.get( m.id );

                if( model ){
                    
                    model.bind( 'change', m.noteUpdate, m );
                    model.bind( 'destroy', m.noteDestroy, m );
                }
            });
        },

        /**
         * 添加变更记录
         * @param m
         * @param type
         */
        addChange: function( m, type ){

            if( !m.get( 'syncMarked' ) && !this.get( m.id ) ){

                m.set({ 'syncMarked': true });

                var change = this.create({
                    id: m.get( 'id' ),
                    _id: m.get( '_id' ),
                    type: type,
                    date: Date.now(),
                    note: m.toJSON()
                });

                // 绑定变化到Mchange
                m.bind( 'change', change.noteUpdate, change );
                m.bind( 'destroy', change.noteDestroy, change );
            }
        },

        clear: function(){

            this.forEach( function( change ){

                change.destroy();
            });
        }
    }),

    Msync = Backbone.Model.extend({

        defaults: {
            synced: false,
            sync: null,
            notes: null,
            table: null
        },

        urlRoot: '/res/sync/',

        localStorage: new MODS.localStorageStore( 'sync' ),

        initialize: function(){

            // 设置notes为私有变量
            var Notes = this.get( 'notes' ),
                Changes = new CLchange(),
                that = this;
            this.set({ 'notes': null });

            Changes.bindModels( Notes );

            // 设置当笔记发生变动时，自动更新记录到同步表中
            Notes.bind( 'change', function( m ){

                this.addChange( m, 'update' );
            }, Changes );

            Notes.bind( 'add', function( m ){

                this.addChange( m, 'add' );
            }, Changes );

            Notes.bind( 'remove', function( m ){

                this.addChange( m, 'del' );
            }, Changes );

            // 实时保存
            this.bind( 'change', function( m ){

                this.save({}, { silent: true });
            }, this );
            
            this.getChanges = function(){

                return Changes;
            };

            this.getNotes = function(){

                return Notes;
            };
            
            this.fetch();
            this.save();
        },

        pushSync: function(){

            var that = this;

            this.buildSyncTable();

            $.ajax({
                type: "post",
                url: this.urlRoot,
                dataType: 'json',
                data: JSON.stringify( this.get( 'table' ) ),
                success: function( data ){

                    if( !_.isObject( data ) ){

                        data = JSON.parse( data );
                    }

                    that.updateNotes( data );

                    // 清理变更记录
                    that.getChanges().clear();

                    that.set( { synced: true, sync: Date.now() } );

                    that.buildSyncTable();

                    that.save();
                    
                },
                error: function( err ){

                    //var data = JSON.parse( err.responseText );

                    console.log( err.responseText );
                }
            });
        },

        /**
         * 经从服务器返回的数据更新到models中
         * 由于在执行完updateNotes后就回将所有的变更记录清理一遍，因此不用担心更新model的时候又重新添加了变更记录
         * @param changeList
         */
        //todo 要考虑下以_id来进行检查配对数据的情况
        //不同登陆序列可能会出现不同的client id 对应相同 _id的情况
        //todo 更新还有问题
        updateNotes: function( changeList ){

            var notes = this.getNotes(),
                changes = this.getChanges(),
                that = this;

            _.each( changeList, function( change ){
               
                var type = change.type,
                    note = change.note,
                    id = note.id,
                    _id = change._id,
                    clientNote = notes.get( id );

                if( type === 'del' ){

                    if( clientNote ){

                        clientNote.destroy();
                    }
                }
                else {

                    if( !clientNote ){

                        clientNote = notes.create( note );
                    }
                    else {

                        clientNote.set( note, { silent: true } );
                    }

                    clientNote.save( {}, { silent: true } );
                }
            });
        },

        buildSyncTable: function(){

            var changes = this.getChanges(),
                changeList = [],
                changeIndex = {},
                table;

            changes.forEach( function( m, index ){

                var note = m.get( 'note' ),
                change = {
                    type: m.get( 'type' ),
                    date: m.get( 'date' ),
                    note: note
                };

                if( note._id !== undefined ){

                    change._id = note._id;
                    changeIndex[ note._id ] = index;
                }

                changeList.push( change );
            });
            
            table = {
                sync: this.get( 'sync' ),
                synced: this.get( 'synced' ),
                changeList: changeList,
                changeIndex: changeIndex
            };



            this.set( { 'table': table } );

            console.log( this.get( 'table' ) );
            return table;
        }
    });


    MODELS[ 'sync' ] = Msync;
    MODELS[ 'change' ] = Mchange;
    MODELS[ 'changes' ] = CLchange;

})( window[ 'freenote' ] );