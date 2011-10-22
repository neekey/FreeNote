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


        },

        noteUpdate: function( m ){

            this.set({
                'note': m.toJSON(),
                'date': Date.now(),
                'type': 'update'
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
         * 添加变更记录
         * @param m
         * @param type
         */
        addChange: function( m, type ){

            if( !m.get( 'syncMarked' ) ){

                m.set({ 'syncMarked': true }, {
                    silent: true
                });

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
        }
    }),

    Msync = Backbone.Model.extend({

        defaults: {
            synced: false,
            sync: null,
            notes: null
        },

        localStorage: new MODS.localStorageStore( 'sync' ),

        initialize: function(){

            // 设置notes为私有变量
            var Notes = this.get( 'notes' ),
                Changes = new CLchange(),
                that = this;
            this.set({ 'notes': null });

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

                //this.save();
            }, this );

            this.fetch();
            this.save();
        }
    });


    MODELS[ 'sync' ] = Msync;
    MODELS[ 'change' ] = Mchange;
    MODELS[ 'changes' ] = CLchange;

})( window[ 'freenote' ] );