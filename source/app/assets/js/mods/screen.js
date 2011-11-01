/**
 * 用于屏幕尺寸等的监测
 */
(function( APP ){

var MODS = APP.mods;

var screen = {

    info: {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
    }
};

MODS[ 'screen' ] = screen;
})( window[ 'freenote' ] );