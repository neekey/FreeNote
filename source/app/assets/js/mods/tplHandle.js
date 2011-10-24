(function( APP ){

var MODS = APP.mods;

var TPLS = {};

var handle = {

    getTpl: function( tplName, fn ){

        var data = TPLS[ tplName ];

        if( data ){

            fn( data );
        }
        else {
            data = localStorage.getItem( 'freenote_tpl-' + tplName );

            if( data ){

                TPLS[ tplName ] = data;

                fn( data );
            }
            else {

                $.get( './' + tplName + '.tpl', function( data ){

                    TPLS[ tplName ] = data;

                    localStorage.setItem( 'freenote_tpl-' + tplName, data );

                    fn( data );
                });
            }
        }

    },

    require: function( tplArr, fn ){

        var totalReq = tplArr.length,
            that = this;

        _.each( tplArr, function( tplName ){

            that.getTpl( tplName, function( data ){

                totalReq--;

                if( totalReq === 0 ){

                    fn( TPLS );
                }
            });
        });
    },

    get: function( tplName ){

        var data = TPLS[ tplName ];

        if( data ){

            return data;
        }
        else {

            data = localStorage.getItem( 'freenote_tpl-' + tplName );

            return data;
        }
    }
}

MODS[ 'tpl' ] = handle;

})( window[ 'freenote' ] );