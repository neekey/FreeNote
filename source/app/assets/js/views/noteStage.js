/**
 * noteStage view
 */
(function( APP ){

var MODS = APP.mods,
    VIEWS = APP.views,
    TRANS = MODS.transform;

var VnoteStage = Backbone.View.extend({

    initialize: function(){

        var that = this;

        _.extend( this, Backbone.Events );

        this.model.bind( 'change', this.position, this );

        this.el.bind( 'dragEnd', function(){

            that.render();
        });

        if( this.model.get( 'located' ) ){

            this.position();
        }
        else {

            this.iniLocate();
            this.model.set({ located: true } );
        }
    },

    iniLocate: function(){

        this.model.set( {
            x: parseInt( this.el.css( 'width' ) ) / 2 * ( -1 ),
            y: parseInt( this.el.css( 'height' ) ) / 2 * ( -1 )
        });
    },
    /**
     * 根据view来更新mdoel
     */
    render: function(){

        var trans = TRANS.get( this.el[ 0 ], 'translate' );

        this.model.set( trans, {
            silent: true
        });

        this.model.save({}, { silent: true });
    },

    /**
     * 根据model 来更新view
     */
    position: function(){

        var model = this.model.toJSON();

        TRANS.set( this.el[ 0 ], 'translate', {
            x: model.x,
            y: model.y
        });
    }
});

VIEWS[ 'noteStage' ] = VnoteStage;

})( window[ 'freenote' ] );