/**
 * drag for Zepto.js
 */

(function($){

    var translateEx = /translate\(([^\)]*)\)/;

    /*
     * @param options
     *  {   dir: 'x' || 'y' || 'xy', // 拖拽方向
     *      handlers: el || jqEl || array // handlers
     *  }
     */
    $.fn[ 'drag' ] = function( options ){

        options = options || {};

        var handlers =  options.handlers || [ this ];

        if( !_.isArray( handlers ) ){

            handlers = [ handlers ];
        }

        var dragDir = options ? options.dir ? options.dir : 'xy' : 'xy';

        if( dragDir !== 'xy' && dragDir !== 'x' && dragDir !== 'y' ){

            dragDir = 'xy';
        }

        var that = this,
            startX, startY, lastX, lastY,
            curX = 0, curY = 0;

        _.each( handlers, function( handler ){

            $( handler ).bind( 'touchstart', dragStart, false );
            $( handler ).bind( 'touchmove', dragMove, false );
            $( handler ).bind( 'touchend', dragEnd, false );
        });

        function dragStart( e ) {

            e.preventDefault();
            e.stopPropagation();

            if ( ! e.touches.length ) return;

            var touch = e.touches[0],
                webkitTransform = that[ 0 ].style.webkitTransform,
                lastArr = translateEx.exec( webkitTransform );

            if( lastArr ){
                lastArr = lastArr[ 1 ].split( ',' );
            }
            else {
                lastArr = [ 0, 0 ];
            }

            startX = touch.pageX;
            startY = touch.pageY;

            lastX = parseInt( lastArr[ 0 ] );
            lastY = parseInt( lastArr[ 1 ] );

            that.trigger( 'dragStart' );
        }

        function dragMove( e ){

            e.preventDefault();
            e.stopPropagation();

            if ( !e.touches.length) return;

            var touch = e.touches[0];
                webkitTransform = that[ 0 ].style.webkitTransform,
                translateStr = 'translate(';

            curX = touch.pageX - startX + lastX;
            curY = touch.pageY - startY + lastY;

            if( dragDir === 'xy' ){

                translateStr += curX + 'px, ' + curY + 'px)';
            }
            else if( dragDir === 'x' ){

                translateStr += curX + 'px, 0px )';
            }
            else {

                translateStr += '0px, ' + curY + 'px)';
            }

            if( translateEx.test( webkitTransform ) ){

                that[ 0 ].style.webkitTransform = webkitTransform.replace( translateEx, translateStr );
            }
            else {

                that[ 0 ].style.webkitTransform += translateStr;
            }

            that.trigger( 'dragMove' );
        }

        function dragEnd( e ){

            e.preventDefault();
            e.stopPropagation();

            that.trigger( 'dragEnd' );
        }

    return this;
};
})(Zepto);
