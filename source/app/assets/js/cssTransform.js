(function( APP ){

var translateEx = /translate\(([^\)]*)\)/,
    scaleEx = /scale\(([^\)]*)\)/,
    rotateEx = /rotate\(([^\)]*)\)/;

var transform = {

    set: function( dom, type, value ){

        if( dom && dom.style ){

            var webkitTransform = dom.style.webkitTransform,
                result;

            switch( type ){
                case 'translate':

                    value.x = value.x !== undefined ? value.x : 0;
                    value.y = value.y !== undefined ? value.y : 0;

                    if( translateEx.test( webkitTransform ) ){

                        webkitTransform = webkitTransform.replace( translateEx, 'translate(' + value.x + 'px,' + value.y + 'px)');
                    }
                    else {
                        webkitTransform += ' translate(' + value.x + 'px,' + value.y + 'px)';
                    }

                    dom.style.webkitTransform = webkitTransform;

                    break;
                case 'scale':

                    if( scaleEx.test( webkitTransform ) ){

                        webkitTransform = webkitTransform.replace( scaleEx, 'scale(' + value + ')' );
                    }
                    else {

                        webkitTransform += 'scale(' + value + ')';
                    }

                    dom.style.webkitTransform = webkitTransform;

                    break;
                case 'rotate':

                    if( rotateEx.test( webkitTransform ) ){

                        webkitTransform = webkitTransform.replace( rotateEx, 'rotate(' + value + 'deg)' );
                    }
                    else {

                        webkitTransform += ' rotate(' + value + 'deg)';
                    }

                    dom.style.webkitTransform = webkitTransform;

                    break;
                default:

                    result = false;
            }

            return result;
        }
        else {

            return false;
        }
    },

    get: function( dom, type ){

        if( dom && dom.style ){

            var webkitTransform = dom.style.webkitTransform,
                result;

            switch( type ){
                case 'translate':

                    var transArr = translateEx.exec( webkitTransform );

                    if( transArr ){

                        transArr = transArr[ 1 ].split( ',' );
                    }
                    else {

                        transArr = [ 0, 0 ];
                    }

                    result = {
                        x: parseFloat( transArr[ 0 ] ),
                        y: parseFloat( transArr[ 1 ] )
                    };

                    break;
                case 'scale':

                    var scaleStr = scaleEx.exec( webkitTransform );

                    if( scaleStr ){

                        result = parseFloat( scaleStr[ 1 ] );
                    }
                    else {

                        result = 0;
                    }

                    break;
                case 'rotate':

                    var rotateStr = rotateEx.exec( webkitTransform );

                    if( rotateStr ){

                        result = parseFloat( rotateStr[ 1 ] );
                    }
                    else {

                        result = 0;
                    }

                    break;
                default:

                    result = false;
            }

            return result;
        }
        else {

            return false;
        }
    }
}

APP.mods[ 'transform' ] = transform;

})( window[ 'freenote' ] );