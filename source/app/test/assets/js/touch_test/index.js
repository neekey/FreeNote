$( document ).ready(function(){

    var mover = $( '#J_mover' ),
        startX = null,
        startY = null,
        lastX = 0,
        lastY = 0,
        curX = 0,
        curY = 0,
        startScale = null,
        startRotation = null,
        maxScale = 2,
        minScale = 0.5;

    window[ 'mover' ] = mover;

    var fold = $( '#J_fold' ),
        unfold = $( '#J_unfold')
    fold.bind( 'click', function(){

        mover.removeClass( 'unfold' );
        mover.addClass( 'fold' );
    });

    unfold.bind( 'click', function(){

        mover.removeClass( 'fold' );
        mover.addClass( 'unfold' );
    });

    function touchStart( event ) {


             event.preventDefault();

             if ( ! event.touches.length ) return;

             var touch = event.touches[0];

             startX = touch.pageX;
             startY = touch.pageY;

        lastX = curX;
        lastY = curY;
    }

    function touchMove( event ){

        event.preventDefault();
        
        if ( !event.touches.length) return;

        var touch = event.touches[0],
            curX = touch.pageX - startX + lastX,
            curY = touch.pageY - startY + lastY;

        mover[ 0 ].style.webkitTransform = 'translate(' + curX + 'px, ' + curY + 'px)';

    }

    function touchEnd( event ){

        event.preventDefault();

        startX = curX;
        startY = curY;
    }

    function gestureStart( event ){

        event.preventDefault();
    }

    function gestureChange( e ){

        if( startScale === null || startRotation === null ){

            startScale = e.scale;
            startRotation = e.rotation;
        }
        else {

            var scale = e.scale * startScale,
                rotation = e.rotation + startRotation;

            if( scale > maxScale ) scale = maxScale;
            if( scale < minScale ) scale = minScale;

            mover[ 0 ].style.webkitTransform = 'scale(' + scale + ')';

            if( scale > minScale && scale < maxScale ){

                startScale *= e.scale;
            }

            startRotation += e.rotation;

        }
    }

    mover[ 0 ].addEventListener( 'touchstart', touchStart, false );
    mover[ 0 ].addEventListener( 'touchmove', touchMove, false );
    mover[ 0 ].addEventListener( 'touchend', touchEnd, false );

    //mover[ 0 ].addEventListener( 'gesturechange', gestureChange, false );
    //mover[ 0 ].addEventListener( 'gesturestart', gestureStart, false );

    
});

