/**
 * configuration
 */

(function( APP ){

var MODELS = APP.models,
    MODS = APP.mods,
    SCREEN = MODS.screen,
    VIEWS = APP.views,
    TOUCH = MODS.touch,
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
        this.render();

        this.model.bind( 'change', this.render, this );

        TOUCH.dbClick( this.el[ 0 ], this._noteTouch, this );
        TOUCH.drag( this.el[ 0 ], this.el[ 0 ] );

        this.el.appendTo( this.noteList );
    },

    events: {

    },

    render: function(){

        var model = this.model,
            content = model.get( 'content' ),
            tag = model.get( 'tags' ).join( ' ' );

        this.content.text( content );
        this.tags.text( tag );
    },

    _noteTouch: function(){

        this.trigger( 'noteTouch' );
    },

    edit: function(){

        var noteForm = this.noteForm;
        noteForm.editNote( this.model );
    }
});

VIEWS[ 'noteItem' ] = Vnote;




})( window[ 'freenote' ]);
