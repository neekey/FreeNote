(function( APP ){

var translateEx = /translate\(([^\)]*)\)/;

APP[ 'mods' ][ 'touch' ] = {

    click: function( dom, fn, context ){

        dom.addEventListener( 'touchend', fn, false );
    },

    tab: function( dom, fn ){

        var moved = false;
        dom.addEventListener( 'touchstart', function(){

            moved = false;
        }, false );

        dom.addEventListener( 'touchmove', function(){

            moved = true;
        }, false );

        dom.addEventListener( 'touchend', function(){

            if( !moved ){

                fn.apply( this, arguments );
            }
        }, false );
    },

    drag: function( trigger, mover, options ){

        if( trigger._removeDrag ) return;

        var startX, startY, lastX, lastY,
            curX = 0, curY = 0,
            dragDir = options ? options.dir ? options.dir : 'xy' : 'xy';

        if( dragDir !== 'xy' && dragDir !== 'x' && dragDir !== 'y' ){

            dragDir = 'xy';
        }

        trigger.addEventListener( 'touchstart', dragStart, false );
        trigger.addEventListener( 'touchmove', dragMove, false );
        trigger.addEventListener( 'touchend', dragEnd, false );


        trigger._removeDrag = function(){

            this.removeEventListener( 'touchstart', dragStart );
            this.removeEventListener( 'touchmove', dragMove );
            this.removeEventListener( 'touchend', dragEnd );

        }

        function dragStart( event ) {

            event.preventDefault();
            event.stopPropagation();

            if ( ! event.touches.length ) return;

            var touch = event.touches[0],
                webkitTransform = mover.style.webkitTransform,
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

            if( options.touch ){

                options.touch.apply( this, arguments );
            }
        }

        function dragMove( event ){

            event.preventDefault();
            event.stopPropagation();

            if ( !event.touches.length) return;

            var touch = event.touches[0];
                webkitTransform = mover.style.webkitTransform,
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

                mover.style.webkitTransform = webkitTransform.replace( translateEx, translateStr );
            }
            else {

                mover.style.webkitTransform += translateStr;
            }

            if( options.move ){

                options.move.apply( this, arguments );
            }
        }

        function dragEnd( event ){

            event.preventDefault();
            event.stopPropagation();

            if( options.end ){

                options.end.apply( this, arguments );
            }
        }
    }
}
})( window[ 'freenote' ] );