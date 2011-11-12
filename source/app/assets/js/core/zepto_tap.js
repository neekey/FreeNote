/**
 * tap for Zepto.js
 */

(function($){

    var translateEx = /translate\(([^\)]*)\)/;

    /*
     * @param options
     *  {   dir: 'x' || 'y' || 'xy', // 拖拽方向
     *      handlers: el || jqEl || array // handlers
     *  }
     */
    $.fn[ 'tap' ] = function( callback ){

        if( callback && _.isFunction( callback ) ){

            this.bind( 'tap', callback );
        }
        
        if( _.isEmpty( $.os ) ){

            this.bind( 'click', function( e ){

                $( this ).trigger( 'tap', e );
            });

            return this;
        }

        var moved = false, touch;

        this.data( 'tap', 'bind' );

        this.bind( 'touchstart', function( e ){

            touch = e.touches[ 0 ];
            moved = false;
        });

        this.bind( 'touchmove', function(){

            moved = true;
        });

        this.bind( 'touchend', function(){

            if( !moved ){

                $( this ).trigger( 'tap', touch );
            }
        }, false );

        return this;
    };

    $.fn[ 'dbTap' ] = function( callback ){

        var tapCount = 0, target;

        if( callback ){

            this.bind( 'dbTap', callback );
        }

        // 判断是否已经绑定过tap
        if( this.data( 'tap' ) !== 'bind' ){

            this.tap();
        }

        function resetTap(){

            target = null;
            tapCount = 0;
        }

        this.bind( 'tap', function( e ){

            var _target = e && e.data && e.data.target;

            if( _target ){

                if( tapCount === 0  ){

                    target = _target;
                    tapCount++;

                    setTimeout( resetTap, 250 );
                }
                else if( tapCount === 1 ){

                    if( target === _target ){

                        $( this ).trigger( 'dbTap', e.data );
                    }

                    resetTap();
                }
                else {

                    resetTap();
                }
            }
        });
    }
})(Zepto);
