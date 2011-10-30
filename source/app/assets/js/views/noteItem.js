/**
 * configuration
 */

(function( APP ){

var MODELS = APP.models,
    MODS = APP.mods,
    SCREEN = MODS.screen,
    VIEWS = APP.views,
    TOUCH = MODS.touch,
    TRANS = MODS.transform,
    TPL = MODS.tpl;

var Vnote = Backbone.View.extend({

    initialize: function(){

        var screenInfo = SCREEN.info;

        this.el = $( TPL.get( 'noteItem' ) );

        // 动态设置noteItem的尺寸
        this.el.width( parseInt( screenInfo.width * 0.35 ) );
        this.el.height( parseInt( screenInfo.height * 0.35 ) );
        
        this.content = this.$( '.content' );
        this.tags = this.$( '.tag' );
        this.noteList = $( '#J_note-list' );

        this.position();
        // 第一次渲染
        this.render();

        this.model.bind( 'change:content', this.render, this );
        this.model.bind( 'change:tags', this.render, this );
        this.model.bind( 'change:x', this.position, this );
        this.model.bind( 'change:y', this.position, this );
        this.bind( 'move', this.render, this );

        // 添加双击触发
        TOUCH.dbClick( this.el[ 0 ], function(){
            this.trigger( 'noteTouch' );
        }, this );

        // 添加拖拽
        TOUCH.drag( this.el[ 0 ], this.el[ 0 ] );

        // 加入到dom树中
        this.el.appendTo( this.noteList );
    },

    events: {

    },

    /**
     * 更具model更新content和tags
     * 更具view当前位置更新model（silent）
     */
    render: function(){

        var model = this.model,
            content = model.get( 'content' ),
            tag = model.get( 'tags' ).join( ' ' );

        this.content.text( content );
        this.tags.text( tag );

        // 根据当前translate来更新model
        var trans = TRANS.get( this.el[ 0 ], 'translate' );

        this.model.set( trans, {
            silent: true
        });
    },

    /**
     * 根据当前model的值来对view进行定位
     */
    position: function(){

        var x = this.model.get( 'x' ),
            y = this.model.get( 'y' );

        TRANS.set( this.el[ 0 ], 'translate', {
            x: x,
            y: y
        });
    },

    edit: function(){

        var noteForm = this.noteForm;
        noteForm.editNote( this.model );
    }
});

VIEWS[ 'noteItem' ] = Vnote;




})( window[ 'freenote' ]);
