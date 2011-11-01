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
        // stage当前的位置信息
        x: 0,
        y: 0,
        // 是否初始化过（进行默认定位，第一次 ）
        located: false
    },

    localStorage: new MODS.localStorageStore( 'noteStage' ),
    
    initialize: function(){

        this.fetch();

        this.bind( 'change', function(){

            this.save({}, { silent: true });
        }, this );
        
        this.save({}, { silent: true })
    }
});

MODELS[ 'noteStage' ] = MnoteStage;

})( window[ 'freenote' ] );