/**
 * noteStage
 *
 */
(function( APP ){

var MODS = APP.mods,
    MODELS = APP.models,
    SCREEN = MODS.screen;

var MnoteStage = Backbone.Model.extend({

    defaults: {
        x: 0,
        y: 0
    },

    initialize: function(){

        var sInfo = SCREEN.info;

        this.set({ 
            w: sInfo.width,
            h: sInfo.height
        });
    }
});

MODELS[ 'noteStage' ] = MnoteStage;

})( window[ 'freenote' ] );