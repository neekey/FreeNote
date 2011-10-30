//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){

    var translateEx = /translate\(([^\)]*)\)/;

    /**
     * 拖拽
     * @param options
     *  {   dir: 'x' || 'y' || 'xy', // 可以拖拽的方向
     *      handlers: el || jqEl || array // 用于拖拽的handlers
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

        var that = this;

        _.each( handlers, function( handler ){

            var startX, startY, lastX, lastY,
                curX = 0, curY = 0;

            $( handler ).bind( 'touchstart', dragStart, false );
            $( handler ).bind( 'touchmove', dragMove, false );
            $( handler ).bind( 'touchend', dragEnd, false );

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


        });

    return this;
};
})(Zepto);
