/**
 * model - user
 * @author Neekey<ni184775761@gmail.com>
 */

(function( APP ){

    var MODS = APP.mods,
        MODELS = APP.models;

    var Mtag  =  Backbone.Model.extend({

        defaults: {
            'value': '',
            'notes': []
        },

        localStorage: new MODS.localStorageStore( 'tag' ),
        /**
         * 添加笔记记录
         * @param id
         */
        addNote: function( id ){

            if( _.indexOf( this.get( 'notes' ), id ) < 0 ){

                this.get( 'notes' ).push( id );
            }
        },

        /**
         * 删除笔记记录
         * @param id
         */
        removeNote: function( id ){

            var index = _.indexOf( this.get( 'notes' ), id );

            if( index ){

                this.get( 'notes' ).splice( index, 1 );
            }
        }
    }),

    Mnote = Backbone.Model.extend({

        defaults: {
            'content': '',
            'tags': [],
            'created': '',
            'updated': '',
            // 用于标识，该笔记是否在同步表里已经有相关记录
            'syncMarked': false
        },
        
        localStorage: new MODS.localStorageStore( 'note' ),

        initailize: function(){
        }
    }),

    CLtag = Backbone.Collection.extend({

        model: Mtag,

        defaults: {
            notes: null
        },

        initialize: function(){

            var Notes = this.get( 'notes' );
            this.set( 'notes', null );

            // 绑定笔记的tags信息的变化，自动更新到tags中去
            Notes.bind( 'change:tags', function( m, newTags ){

                var oldTags = m.previous( 'tags' ),
                    addTags = _.difference( newTags, oldTags ),    // 该笔记新添加的tag
                    delTags = _.difference( oldTags, newTags );

                this.addNote( m.get( 'id' ), addTags );
                this.delNote( m.get( 'id' ), delTags );

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

                if( tags[ i ].value === name ){

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

                    this.create({
                        value: name
                    });
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

        localStorage: new MODS.localStorageStore( 'tag' ),

        initialize: function(){

            // 创建笔记集合对应的标签集合
            var Tags = new CLtag({
                notes: this
            });

            // 同步表
            var Sync = new APP[ 'models' ][ 'changes' ]({
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

        initailize: function(){
        }
    });


    MODELS[ 'tag' ] = Mtag;
    MODELS[ 'note' ] = Mnote;
    MODELS[ 'tags' ] = CLtag;
    MODELS[ 'notes' ] = CLnote;
    MODELS[ 'user' ] = Muser;

})( window[ 'freenote' ] );

