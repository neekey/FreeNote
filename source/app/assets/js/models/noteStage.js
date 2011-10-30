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
        // 记录当前的translate偏移
        x: 0,
        y: 0
    },

    initialize: function(){
    }
});

MODELS[ 'noteStage' ] = MnoteStage;

})( window[ 'freenote' ] );