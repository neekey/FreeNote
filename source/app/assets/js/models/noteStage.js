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
        // ��¼��ǰ��translateƫ��
        x: 0,
        y: 0
    },

    initialize: function(){
    }
});

MODELS[ 'noteStage' ] = MnoteStage;

})( window[ 'freenote' ] );