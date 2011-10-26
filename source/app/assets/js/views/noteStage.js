/**
 * noteStage view
 */
(function(){

var MODS = APP.mods,
    MODELS = APP.models,
    VIEWS = APP.views,
    TRANS = MODS.transform,
    SCREEN = MODS.screen;

var VnoteStage = Backbone.View.extend({

    initialize: function(){

        _.extend( this, Backbone.Events );

        this.model.bind( 'change', this.render, this );
        this.bind( 'move', this.position, this );
    },

    render: function(){
        
        var model = this.model.toJSON();
        this.el.width( model.w );
        this.el.height( model.h );
        TRANS.set( this.el[ 0 ], 'translate', {
            x: model.x,
            y: model.y
        });
    },

    position: function(){

        var trans = TRANS.get( this.el[ 0 ], 'translate' ),
            transX = trans.x,
            transY = trans.y,
            model = this.model.toJSON(),
            screenInfo = SCREEN.info,
            disX, disY;

        if( transX >= 0 ){

            model.w += transX;
            model.x = 0;
        }
        else {

            disX = ( screenInfo.width - ( model.w + transX ) );
            if( disX > 0  ){

                model.w += disX;
            }

            model.x = disX;
        }

        if( transY >= 0 ){

            model.h += transY;
            model.y = 0;
        }
        else {

            disY = ( screenInfo.height - ( model.h + transY ) );
            if( disY > 0  ){

                model.h += disY;
            }
            model.y = disY;
        }

        this.model.set( model );
    }
});

VIEWS[ 'noteStage' ] = VnoteStage;

})()