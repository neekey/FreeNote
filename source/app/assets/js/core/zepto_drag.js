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
                translateInfo = that.transform( 'get', 'translate' );

            startX = touch.pageX;
            startY = touch.pageY;

            lastX = translateInfo.x;
            lastY = translateInfo.y;

            that.trigger( 'dragStart' );
        }

        function dragMove( e ){

            e.preventDefault();
            e.stopPropagation();

            if ( !e.touches.length) return;

            var touch = e.touches[0];

            curX = touch.pageX - startX + lastX;
            curY = touch.pageY - startY + lastY;

            if( dragDir === 'xy' ){

                that.transform( 'set', { translateX: curX, translateY: curY } );
            }
            else if( dragDir === 'x' ){

                that.transform( 'set', { translateX: curX } );
            }
            else {

                that.transform( 'set', { translateY: curY } );
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
