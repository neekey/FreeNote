/**
 * noteStage view
 */
(function( APP ){

var MODS = APP.mods,
    VIEWS = APP.views,
    TRANS = MODS.transform;

var VnoteStage = Backbone.View.extend({

    initialize: function(){

        _.extend( this, Backbone.Events );

        this.model.bind( 'change', this.render, this );
        this.bind( 'move', this.position, this );

        this.render();
    },

    /**
     * 更具model来更新view
     */
    render: function(){
        
        var model = this.model.toJSON();

        TRANS.set( this.el[ 0 ], 'translate', {
            x: model.x,
            y: model.y
        });
    },

    /**
     * 根据view来更新model（silent set ）
     */
    position: function(){

        var trans = TRANS.get( this.el[ 0 ], 'translate' );

        this.model.set( trans, {
            silent: true
        });
    }
});

VIEWS[ 'noteStage' ] = VnoteStage;

})( window[ 'freenote' ] );