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

        localStorage: new MODS.localStorageStore( 'sync' ),

        initailize: function(){

            var that = this;

            this.set( 'date', Date.now() );
            this.set( 'id', this.noteModel.get( 'id' ) );
            this.set( '_id', this.noteModel.get( '_id' ) );

            // bind update
            this.noteModel.on( 'update', function( m ){

                that.set( 'note', m.toJSON() );
                that.set( 'date', Date.now() );
                that.set( 'type', 'update' );
            });

            // bind destroy
            this.noteModel.on( 'destroy', function( m ){

                that.set( 'note', m.toJSON() );
                that.set( 'date', Date.now() );
                that.set( 'type', 'del' );
            });
        },

        noteUpdate: function( m ){

            this.set( 'note', m.toJSON() );
            this.set( 'date', Date.now() );
            this.set( 'type', 'update' );
        },

        noteDestroy: function( m ){

            this.set( 'note', m.toJSON() );
            this.set( 'date', Date.now() );
            this.set( 'type', 'del' );
        }
    }),

    CLchange = Backbone.Collection.extend({

        model: Mchange,

        defaults: {
            synced: false,
            notes: null
        },

        localStorage: new MODS.localStorageStore( 'sync' ),

        initailize: function(){

            // 设置notes为私有变量
            var Notes = this.get( 'notes' ), that = this;
            this.set( 'notes', null );

            // 读取已经有的同步表信息
            this.fetch();

            // 设置当笔记发生变动时，自动更新记录到同步表中
            Notes.bind( 'change', function( m ){

                this.addChange( m, 'update' );
            }, this );

            Notes.bind( 'add', function( m ){

                this.addChange( m, 'add' );
            }, this );

            Notes.bind( 'remove', function( m ){

                this.addChange( m, 'del' );
            }, this );
        },

        /**
         * 添加变更记录
         * @param m
         * @param type
         */
        addChange: function( m, type ){

            if( !m.get( 'syncMarked' ) ){

                m.set( 'syncMarked', true );

                var change = this.create({
                    id: m.get( 'id' ),
                    _id: m.get( '_id' ),
                    type: type,
                    date: Date.noew(),
                    note: m.toJSON(),
                });

                // 绑定变化到Mchange
                m.bind( 'change', change.noteUpdate, change );
                m.bind( 'destroy', change.noteDestroy, change );
            }
        }
    });

    MODELS[ 'change' ] = Mchange;
    MODELS[ 'changes' ] = CLchange;

})( window[ 'freenote' ] );