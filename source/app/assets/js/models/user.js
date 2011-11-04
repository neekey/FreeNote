/**
 * model - user
 * @author Neekey<ni184775761@gmail.com>
 */

//todo 将各model分离出来

(function( APP ){

    var MODS = APP.mods,
        MODELS = APP.models;

    var Mtag  =  Backbone.Model.extend({

        defaults: {
            'value': '',
            'notes': [],
            'x': 0,
            'y': 0
        },

        initialize: function(){

            this.bind( 'change', function(){
                this.save();
            }, this );
        },

        localStorage: new MODS.localStorageStore( 'tag' ),
        /**
         * 添加笔记记录
         * @param id
         */
        addNote: function( id ){

            if( _.indexOf( this.get( 'notes' ), id ) < 0 ){

                var notes = _.clone( this.get( 'notes' ) );
                    notes.push( id );
                this.set({ notes: notes });
            }
        },

        /**
         * 删除笔记记录
         * @param id
         */
        removeNote: function( id ){

            var index = _.indexOf( this.get( 'notes' ), id );

            if( index ){

                var notes = _.clone( this.get( 'notes' ) );
                    notes.splice( index, 1 );
                this.set({ notes: notes });
                
            }
        }
    }),

    Mnote = Backbone.Model.extend({

        defaults: {
            'content': '',
            'tags': [],
            // 记录笔记在桌面上的显示位置
            'x': 0,
            'y': 0,
            'created': '',
            'updated': '',
            // 用于标识，该笔记是否在同步表里已经有相关记录
            'syncMarked': false
        },
        
        localStorage: new MODS.localStorageStore( 'note' ),

        initialize: function(){

            this.set({
                created: Date.now(),
                updated: Date.now()
            });
            this.bind( 'change', function(){

                this.set({ updated: Date.now() }, { silent: true });

                // 防止死循环...
                this.save({}, { silent: true } );
            }, this );

            this.save({}, { silent: true } );
        }
    }),

    CLtag = Backbone.Collection.extend({

        model: Mtag,

        defaults: {
            notes: null
        },

        initialize: function(){

            this.fetch();
        },

        init: function(){

            var Notes = this.notes;

            // 绑定笔记的tags信息的变化，自动更新到tags中去
            Notes.bind( 'change:tags', function( m, newTags ){

                var oldTags = m.previous( 'tags' ),
                    addTags = _.difference( newTags, oldTags ),    // 该笔记新添加的tag
                    delTags = _.difference( oldTags, newTags );

                this.addNote( m.get( 'id' ), addTags );
                this.delNote( m.get( 'id' ), delTags );
            }, this );

            Notes.bind( 'add', function( m ){

                this.addNote( m.get( 'id' ), m.get( 'tags' ) );
            }, this );

            Notes.bind( 'remove', function( m ){

                this.delNote( m.get( 'id' ), m.get( 'tags' ) );
            }, this );
        },

        localStorage: new MODS.localStorageStore( 'tag' ),

        /**
         * 根据标签名称获取标签
         * @param name
         */
        getByName: function( name ){

            var tags = this.models,
                len = tags.length, i;

            for( i = 0; i < len; i++ ){

                if( tags[ i ].get( 'value' ) === name ){

                    return tags[ i ];
                }
            }
        },

        /**
         * 向指定的标签数组中添加笔记记录
         * @param noteId
         * @param tags
         */
        addNote: function( noteId, tags ){

            var name, tag, i, len = tags.length;

            for( i = 0; i < len; i++ ){

                name = tags[ i ];
                tag = this.getByName( name );

                if( tag ){

                    tag.addNote( noteId );
                }
                // 若标签不存在 则添加一个
                else {

                    tag = this.create({
                        value: name
                    });

                    tag.addNote( noteId );
                }
            }
        },

        /**
         * 从指定的标签中删除笔记记录
         * @param noteId
         * @param tags
         */
        delNote: function( noteId, tags ){

            var name, tag, i, len = tags.length;

            for( i = 0; i < len; i++ ){

                name = tags[ i ];
                tag = this.getByName( name );

                if( tag ){

                    tag.removeNote( noteId );
                }
            }
        }
        
    }),

    CLnote = Backbone.Collection.extend({

        model: Mnote,

        localStorage: new MODS.localStorageStore( 'note' ),

        initialize: function(){

            // 创建笔记集合对应的标签集合
            var Tags = new CLtag();
                Tags.notes = this;
                Tags.init();

            // 同步表
            var Sync = new MODELS[ 'sync' ]({
                notes: this
            });

            // 读取已经有的笔记信息
            this.fetch();

        }
    }),

    Muser = Backbone.Model.extend({

        defaults: {
            'name': '',
            'password': ''
        },

        urlRoot: '/res/user/',

        initialize: function(){
        }
    });


    MODELS[ 'tag' ] = Mtag;
    MODELS[ 'note' ] = Mnote;
    MODELS[ 'tags' ] = CLtag;
    MODELS[ 'notes' ] = CLnote;
    MODELS[ 'user' ] = Muser;

})( window[ 'freenote' ] );

