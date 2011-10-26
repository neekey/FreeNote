/**
 * 用于屏幕尺寸等的监测
 */
(function(){

var MODS = APP.mods,
    WIN = $( window );

var screen = {

    info: {
        height: WIN.height(),
        width: WIN.width()
    }
};

MODS[ 'screen' ] = screen;
})();