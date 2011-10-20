(function( APP ){

var touch = {

    click: function( dom, fn, context ){

        dom.addEventListener( 'touchEnd', function(){

            var scope = context || this;

            fn.apply( context, arguments );
        });
    }
}

})( window[ 'freenote' ] );