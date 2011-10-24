/**
 * configuration
 */

(function( APP ){

var MODELS = APP.models,
    MODS = APP.mods,
    VIEWS = APP.views,
    TPL = MODS.tpl;

TPL.require( [ 'noteItem' ], function( TPLS ){

    var Vnote = Backbone.View.extend({

        initialize: function(){

            this.el = $( TPL.get( 'noteItem' ) );
            this.noteList = $( '#J_note-list' );
            this.render();

            this.model.bind( 'change', this.render, this );
        },

        events: {
            
        },

        render: function(){

            var model = this.model,
                content = model.get( 'content' ),
                tag = model.get( 'tag' );

            this.content.text( content );
            this.tag.text( tag );
        }

    });

    VIEWS[ 'noteItem' ] = Vnote;

});



})( window[ 'freenote' ]);
