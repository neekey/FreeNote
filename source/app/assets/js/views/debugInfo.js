/**
 * view for debug models
 */
(function( APP ){

var VIEWS = APP.views;

var VDebug = Backbone.View.extend({

    initialize: function(){

        this.el = $('<li class="debug-item"></li>');

        $( '#J_debug-info' ).append( this.el );

        this.model.bind( 'change', this.render, this );

        this.render();

    },

    render: function(){

        var model = this.model.toJSON();

        this.el.html( JSON.stringify( model ) );
    }
});

VIEWS[ 'debugInfo' ] = VDebug;

})( window[ 'freenote' ]);